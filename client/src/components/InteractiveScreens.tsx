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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
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