import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 10;
      });
    }, 150);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-2 text-white">
          Shaina Shultz
        </h1>
        <p className="text-lg text-gray-300 mb-8">Design Technologist</p>

        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>

        <div className="w-64 mx-auto mb-4">
          <div className="bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <p className="text-sm text-gray-400">Loading Portfolio...</p>
      </div>
    </div>
  );
}
