require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// --- CONNECT TO CLOUD DB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Cloud Connected Successfully!'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// --- MODELS ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const videoSchema = new mongoose.Schema({
    filename: String,
    path: String,
    status: { type: String, default: 'pending' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Video = mongoose.model('Video', videoSchema);

// --- MIDDLEWARE ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized" });
        req.userId = decoded.id;
        next();
    });
};

// --- ROUTES ---
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: "User created!" });
    } catch (err) { res.status(500).json({ error: "User already exists" }); }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, username });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
});

// --- UPLOAD ---
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/upload', verifyToken, upload.single('video'), async (req, res) => {
    try {
        const newVideo = await Video.create({
            filename: req.file.originalname,
            path: req.file.path,
            uploadedBy: req.userId
        });
        
        setTimeout(async () => {
            const isSafe = Math.random() > 0.3;
            newVideo.status = isSafe ? 'safe' : 'flagged';
            await newVideo.save();
            io.emit('videoStatusUpdate', { id: newVideo._id, status: newVideo.status });
        }, 5000);

        res.status(201).json(newVideo);
    } catch (error) { res.status(500).json({ error: 'Upload failed' }); }
});

app.get('/videos', verifyToken, async (req, res) => {
    const videos = await Video.find({ uploadedBy: req.userId }).sort({ createdAt: -1 });
    res.json(videos);
});

app.get('/stream/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).send('Video not found');
        
        const videoPath = video.path;
        const videoSize = fs.statSync(videoPath).size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = { 'Content-Length': videoSize, 'Content-Type': 'video/mp4' };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch(e) { res.sendStatus(500); }
});

server.listen(5000, () => console.log('🚀 Backend running on port 5000'));