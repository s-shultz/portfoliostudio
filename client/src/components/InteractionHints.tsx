import React, { useState, useEffect } from 'react';
import { Monitor, MousePointer, Hand } from 'lucide-react';

interface InteractionHintsProps {
  isVisible: boolean;
}

export default function InteractionHints({ isVisible }: InteractionHintsProps) {
  const [showHints, setShowHints] = useState(true);

  useEffect(() => {
    // Auto-hide hints after 8 seconds
    const timer = setTimeout(() => {
      setShowHints(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || !showHints) return null;

  return (
    <div className="fixed top-24 right-6 z-30 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-black/80 backdrop-blur-md rounded-lg border border-gray-600 p-4 max-w-xs">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-blue-400" />
          Interaction Guide
        </h3>
        
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <Monitor className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>Click monitors to explore different portfolio sections</p>
          </div>
          
          <div className="flex items-start gap-3">
            <Hand className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>Drag to rotate view • Scroll to zoom in/out</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowHints(false)}
          className="mt-3 text-xs text-gray-400 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}