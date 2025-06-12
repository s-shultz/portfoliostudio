import { useState, useEffect } from "react";
import Scene3D from "./Scene3D";
import PortfolioContent from "./PortfolioContent";
import Navigation from "./Navigation";
import LoadingScreen from "./LoadingScreen";
import { usePortfolio } from "../lib/stores/usePortfolio";

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentSection, setCurrentSection } = usePortfolio();

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSceneLoaded = () => {
    setIsLoading(false);
  };

  const handleSceneError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* 3D Scene Background */}
      <Scene3D 
        onLoaded={handleSceneLoaded}
        onError={handleSceneError}
      />

      {/* Navigation */}
      <Navigation />

      {/* Portfolio Content Overlay */}
      <PortfolioContent />
    </div>
  );
}
