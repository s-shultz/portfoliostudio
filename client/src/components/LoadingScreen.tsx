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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Main loading content */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shaina Schultz</h1>
          <p className="text-xl text-blue-200">Full Stack Developer & Designer</p>
        </div>

        {/* Loading spinner */}
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-blue-300 border-t-white rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-80 max-w-md mx-auto mb-4">
          <div className="bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-lg text-blue-200 animate-pulse">{loadingText}</p>

        {/* Additional info */}
        <div className="mt-8 text-sm text-gray-300">
          <p>Creating an immersive 3D portfolio experience</p>
        </div>
      </div>
    </div>
  );
}
