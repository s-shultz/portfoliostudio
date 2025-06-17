import { usePortfolio } from "../lib/stores/usePortfolio";
import { Button } from "./ui/button";
import { User, Briefcase, Code, Mail, Home, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../lib/stores/useAudio";

export default function Navigation() {
  const { currentSection, setCurrentSection } = usePortfolio();
  const { isMuted, toggleMute } = useAudio();

  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
  ] as const;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Shaina Shultz</h1>
              <span className="text-gray-400">Portfolio</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <nav className="fixed left-6 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-600 p-2">
          <div className="flex flex-col space-y-2">
            <Button
              variant={currentSection === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentSection(null)}
              className={`w-12 h-12 p-0 ${
                currentSection === null 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
              title="Home View"
            >
              <Home className="w-5 h-5" />
            </Button>
            
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentSection === id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentSection(id)}
                className={`w-12 h-12 p-0 ${
                  currentSection === id 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Instructions */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/40 backdrop-blur-md rounded-lg border border-gray-600 px-4 py-2">
          <p className="text-sm text-gray-300 text-center">
            Click navigation • Drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>
    </>
  );
}
