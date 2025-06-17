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
    description: "Creating intuitive and beautiful user experiences through thoughtful design.",
    projects: [
      {
        title: "E-commerce Mobile App",
        description: "Complete redesign of shopping experience with focus on conversion optimization",
        tools: ["Figma", "Principle", "User Research", "Prototyping"]
      },
      {
        title: "SaaS Dashboard Design",
        description: "Complex data visualization dashboard with customizable widgets",
        tools: ["Sketch", "InVision", "Usability Testing", "Design Systems"]
      },
      {
        title: "Brand Identity & Web Design",
        description: "Full brand identity and responsive website for tech startup",
        tools: ["Adobe Creative Suite", "Webflow", "Brand Strategy"]
      }
    ]
  },
  coding: {
    title: "Creative Coding",
    icon: <Code className="w-6 h-6" />,
    description: "Bringing ideas to life through interactive web experiences and generative art.",
    projects: [
      {
        title: "WebGL Particle Systems",
        description: "Interactive particle simulations with custom GLSL shaders",
        tools: ["Three.js", "GLSL", "WebGL", "TypeScript"]
      },
      {
        title: "Generative Art Collection",
        description: "Algorithmic art pieces exploring color, form, and motion",
        tools: ["p5.js", "Canvas API", "Mathematical Algorithms"]
      },
      {
        title: "Interactive Data Visualizations",
        description: "Real-time data representations with smooth animations",
        tools: ["D3.js", "React", "SVG", "Animation Libraries"]
      }
    ]
  },
  "3d": {
    title: "3D Modeling & Animation",
    icon: <Box className="w-6 h-6" />,
    description: "Creating immersive 3D environments and bringing characters to life through animation.",
    projects: [
      {
        title: "Architectural Visualization",
        description: "Photorealistic renders of residential and commercial spaces",
        tools: ["Blender", "Substance Painter", "V-Ray", "Photoshop"]
      },
      {
        title: "Character Animation Reel",
        description: "Character rigging and animation for games and film",
        tools: ["Maya", "ZBrush", "Motion Capture", "After Effects"]
      },
      {
        title: "Product Visualization",
        description: "High-quality product renders for marketing and e-commerce",
        tools: ["Cinema 4D", "Octane Render", "Illustrator"]
      }
    ]
  }
};

export default function InteractiveScreens({ activeScreen, onClose }: InteractiveScreensProps) {
  if (!activeScreen) return null;

  const section = portfolioSections[activeScreen];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {section.icon}
            <CardTitle className="text-2xl">{section.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-300">{section.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.projects.map((project, index) => (
              <Card key={index} className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {project.tools.map((tool, toolIndex) => (
                      <Badge 
                        key={toolIndex} 
                        variant="secondary" 
                        className="text-xs bg-blue-600/20 text-blue-300"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}