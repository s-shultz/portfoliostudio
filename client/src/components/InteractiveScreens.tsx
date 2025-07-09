import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, X, Code, Palette, Box } from "lucide-react";

export type ScreenType = "uiux" | "coding" | "3d";

interface InteractiveScreensProps {
  activeScreen: ScreenType | null;
  onClose: () => void;
}

const portfolioSections = {
  uiux: {
    title: "UI/UX Design",
    icon: <Palette className="w-6 h-6" />,
    description: "Designing user interfaces for mixed reality, healthcare, and digital experiences for Fortune 500 clients.",
    portfolioUrl: "https://decagon-ellipse-5gen.squarespace.com/uiuxdesign",
    projects: [
      {
        title: "RadiusXR - Mixed Reality Vision Care",
        description: "Designed comprehensive VR interface screens for patient onboarding and procedural guidance scripts for visual field testing at CitrusBits",
        tools: ["Figma", "VR Design", "Design Systems", "Accessibility"]
      },
      {
        title: "IrisVision - Vision Care Application", 
        description: "Developed user interfaces for mixed reality vision care applications, focusing on accessibility and user experience",
        tools: ["Mixed Reality", "UI Design", "User Research", "Visual QA"]
      },
      {
        title: "Fortune 500 Digital Experiences",
        description: "Designed digital experiences for Amazon, American Express, Anthem Insurance, Bank of America, and NYU Langone at Deloitte Digital",
        tools: ["Figma", "Sketch", "InVision", "Responsive Design"]
      },
      {
        title: "Alchemy Vision Product Design",
        description: "Founding Product Designer developing user flows, wireframes, and interactive prototypes, streamlining design-to-development handoff by 40%",
        tools: ["Product Design", "Prototyping", "Design Systems", "Competitive Analysis"]
      }
    ]
  },
  coding: {
    title: "Creative Coding",
    icon: <Code className="w-6 h-6" />,
    description: "Interactive web experiences combining art, technology, and creative coding with Three.js, P5.js, and generative algorithms.",
    portfolioUrl: "https://decagon-ellipse-5gen.squarespace.com/creative-coding",
    projects: [
      {
        title: "Three.js Interactive Installations",
        description: "Creating immersive web-based 3D experiences using WebGL and custom shaders for artistic expression",
        tools: ["Three.js", "WebGL", "GLSL", "TypeScript"]
      },
      {
        title: "P5.js Generative Art",
        description: "Algorithmic art pieces exploring mathematical patterns, color theory, and interactive motion graphics",
        tools: ["P5.js", "JavaScript", "Generative Algorithms", "Canvas API"]
      },
      {
        title: "TouchDesigner Visual Systems",
        description: "Real-time visual programming for interactive installations and live performance environments",
        tools: ["TouchDesigner", "Real-time Graphics", "Interactive Media", "Visual Programming"]
      },
      {
        title: "Processing Creative Applications",
        description: "Data-driven visualizations and interactive art pieces using computational design principles",
        tools: ["Processing", "Java", "Data Visualization", "Interactive Design"]
      }
    ]
  },
  "3d": {
    title: "Extended Reality & 3D",
    icon: <Box className="w-6 h-6" />,
    description: "3D modeling, animation, and extended reality experiences using industry-standard tools for immersive digital environments.",
    portfolioUrl: "https://decagon-ellipse-5gen.squarespace.com/xrdesign",
    projects: [
      {
        title: "Unity XR Applications",
        description: "Developing immersive virtual and augmented reality experiences for education and healthcare applications",
        tools: ["Unity", "C#", "XR Toolkit", "VR/AR Development"]
      },
      {
        title: "Unreal Engine Environments",
        description: "Creating photorealistic 3D environments and interactive experiences for architectural visualization and gaming",
        tools: ["Unreal Engine", "Blueprint Visual Scripting", "Lighting", "Materials"]
      },
      {
        title: "3Ds Max Architectural Visualization",
        description: "High-quality 3D modeling and rendering for architectural and product visualization projects",
        tools: ["3Ds Max", "V-Ray", "Architectural Modeling", "Photorealistic Rendering"]
      },
      {
        title: "Adobe Substance 3D Pipeline",
        description: "Advanced material creation and texturing workflows for 3D assets and environments",
        tools: ["Substance 3D", "Material Design", "Texturing", "PBR Workflows"]
      },
      {
        title: "Adobe Aero AR Experiences",
        description: "Creating augmented reality experiences for mobile platforms with interactive 3D content",
        tools: ["Adobe Aero", "AR Design", "Mobile AR", "Interactive 3D"]
      }
    ]
  }
};

export default function InteractiveScreens({ activeScreen, onClose }: InteractiveScreensProps) {
  if (!activeScreen) return null;

  const section = portfolioSections[activeScreen];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 md:py-8 md:px-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-4xl h-full max-h-full overflow-y-auto md:h-auto md:max-h-none md:overflow-visible bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 text-white animate-in slide-in-from-bottom-8 zoom-in-95 duration-700 shadow-2xl shadow-blue-500/20 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-blue-500/30 p-3 sm:p-4 md:p-5 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
              {section.icon}
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
              {section.title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-red-400 hover:text-white transition-all duration-300 hover:bg-red-600/20 hover:scale-110 border-2 border-red-400/50 hover:border-red-400 rounded-full flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
          >
            <X className="w-4 h-4 sm:w-6 sm:h-6 font-bold" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 min-h-0">
          <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed">{section.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-5">
            {section.projects.slice(0, 4).map((project, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 sm:hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 flex flex-col">
                <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                  <h3 className="text-xs sm:text-sm font-bold mb-2 text-blue-300 leading-tight">{project.title}</h3>
                  <p className="text-gray-200 text-xs leading-relaxed line-clamp-3 sm:line-clamp-2 flex-1 mb-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {project.tools.slice(0, 3).map((tool, toolIndex) => (
                      <Badge 
                        key={toolIndex} 
                        variant="secondary" 
                        className="text-xs bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white border border-blue-400/30"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-3 pb-3 md:pt-4 md:pb-4 flex justify-center">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 shadow-lg shadow-blue-500/20"
              onClick={() => {
                console.log('Portfolio button clicked:', section.portfolioUrl);
                if (section.portfolioUrl) {
                  window.open(section.portfolioUrl, '_blank');
                } else {
                  console.error('No portfolio URL found for section:', activeScreen);
                }
              }}
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              View Full Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}