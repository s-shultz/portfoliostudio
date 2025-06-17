import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Portfolio...");

  useEffect(() => {
    const texts = [
      "Initializing Portfolio...",
      "Loading 3D Environment...",
      "Setting up Scene...",
      "Preparing Content...",
      "Almost Ready..."
    ];

    let currentIndex = 0;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 100);

    const textInterval = setInterval(() => {
      setLoadingText(texts[currentIndex % texts.length]);
      currentIndex++;
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50 animate-pulse">
      <div className="text-center text-white">
        {/* Main loading content */}
        <div className="mb-8 animate-bounce">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            🚀 SHAINA SHULTZ 🚀
          </h1>
          <p className="text-2xl text-yellow-300 font-bold animate-pulse">⭐ Design Technologist ⭐</p>
        </div>

        {/* Loading spinner */}
        <div className="relative mb-8">
          <div className="w-32 h-32 border-8 border-yellow-300 border-t-pink-500 rounded-full animate-spin mx-auto shadow-2xl shadow-pink-500/50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-yellow-300">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-96 max-w-md mx-auto mb-6">
          <div className="bg-gray-700 rounded-full h-4 border-2 border-yellow-400">
            <div
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out animate-pulse shadow-lg shadow-pink-500/50"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-2xl text-yellow-300 animate-bounce font-bold">🎨 {loadingText} 🎨</p>

        {/* Additional info */}
        <div className="mt-8 text-lg text-pink-300 animate-pulse">
          <p>✨ Creating an AMAZING 3D portfolio experience! ✨</p>
        </div>
      </div>
    </div>
  );
}
