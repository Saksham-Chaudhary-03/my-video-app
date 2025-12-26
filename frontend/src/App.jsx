import React, { useState } from 'react';

function App() {
  const [screen, setScreen] = useState('login');
  const [fileName, setFileName] = useState('');

  // 1. Login Logic
  const handleLogin = (e) => {
    e.preventDefault();
    setScreen('upload');
  };

  // 2. File Select Logic
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  // 3. Upload Logic
  const handleUpload = () => {
    if (!fileName) return alert("Please select a file!");
    setTimeout(() => {
      setScreen('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">

      {/* --- SCREEN 1: LOGIN --- */}
      {screen === 'login' && (
        <div className="flex h-screen">
          {/* Left Side Decoration */}
          <div className="hidden md:flex w-1/3 bg-blue-50 items-center justify-center flex-col gap-4 border-r border-blue-100">
             <div className="text-8xl animate-bounce">🎬</div>
             <p className="text-blue-500 font-bold mt-4 text-xl">Saksham Video App</p>
          </div>

          {/* Right Side Form */}
          <div className="flex-1 flex items-center justify-center bg-white relative">
            <div className="w-96 p-8 border rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Sign In</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input required type="text" className="w-full p-3 border rounded bg-gray-50" placeholder="Username" />
                <input required type="password" className="w-full p-3 border rounded bg-gray-50" placeholder="Password" />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- SCREEN 2: UPLOAD DASHBOARD --- */}
      {screen === 'upload' && (
        <div className="flex h-screen bg-gray-50">
          
          {/* Simple Sidebar (Icons Only) */}
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
            <h1 className="text-xl font-bold text-blue-600 mb-10 flex items-center gap-2">
              <span>▶</span> Video App
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg font-bold">
                <span>🏠</span> Home
              </div>
              <div className="flex items-center gap-3 p-3 text-gray-400">
                <span>👤</span> Profile
              </div>
            </div>

            <div className="mt-auto">
               <p className="text-xs text-gray-400">Logged in as Admin</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 relative">
            
            {/* LOGOUT BUTTON (Top Right Corner) */}
            <button 
              onClick={() => setScreen('login')}
              className="absolute top-6 right-8 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md transition"
            >
              Logout ↪
            </button>

            {/* Upload Box (Center) */}
            <div className="h-full flex flex-col items-center justify-center">
              <div className="bg-white p-12 rounded-2xl shadow-lg text-center w-full max-w-lg border-2 border-dashed border-blue-200">
                <div className="text-6xl mb-4">☁️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Video</h3>
                
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 mb-6 mt-6
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-bold
                    file:bg-blue-50 file:text-blue-700
                    cursor-pointer"
                />

                <button 
                  onClick={handleUpload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition"
                >
                  Upload File 🚀
                </button>
              </div>
            </div>

          </main>
        </div>
      )}

      {/* --- SCREEN 3: THANK YOU --- */}
      {screen === 'success' && (
        <div className="flex h-screen items-center justify-center bg-green-50">
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-6">File <b>{fileName}</b> uploaded successfully.</p>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold inline-block mb-8">
              ✅ Status: Safe
            </div>
            <br />
            <button onClick={() => setScreen('upload')} className="text-blue-600 font-bold underline">
              Upload More
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;