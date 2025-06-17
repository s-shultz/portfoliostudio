import React, { useState, useEffect } from 'react';
import { Monitor, MousePointer, Hand } from 'lucide-react';

interface InteractionHintsProps {
  isVisible: boolean;
}

export default function InteractionHints({ isVisible }: InteractionHintsProps) {
  const [showHints, setShowHints] = useState(true);

  // Remove auto-hide functionality - hints stay until button is clicked

  if (!isVisible || !showHints) return null;

  return (
    <div className="fixed top-24 right-6 z-30">
      <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-md rounded-xl border-2 border-blue-400 p-6 max-w-sm shadow-2xl shadow-blue-500/20">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
          <MousePointer className="w-5 h-5 text-yellow-400 animate-bounce" />
          🎯 Interactive Portfolio
        </h3>
        
        <div className="space-y-4 text-sm text-gray-100">
          <div className="flex items-start gap-3 p-2 bg-white/10 rounded-lg">
            <Monitor className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0 animate-pulse" />
            <p className="font-medium">Click the glowing monitors to explore my work!</p>
          </div>
          
          <div className="flex items-start gap-3 p-2 bg-white/10 rounded-lg">
            <Hand className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p>Drag to rotate • Scroll to zoom</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowHints(false)}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
        >
          Got it! 👍
        </button>
      </div>
    </div>
  );
}