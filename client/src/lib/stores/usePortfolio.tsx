import { create } from "zustand";

export type PortfolioSection = 'about' | 'projects' | 'experience' | 'contact' | null;

interface Project {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  contact: {
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
}

interface PortfolioState {
  currentSection: PortfolioSection;
  portfolioData: PortfolioData;
  isLoading: boolean;
  
  // Actions
  setCurrentSection: (section: PortfolioSection) => void;
  initializePortfolio: () => void;
}

const defaultPortfolioData: PortfolioData = {
  name: "Shaina Schultz",
  title: "3D Designer & Creative Developer",
  bio: "Creative professional specializing in 3D modeling, animation, and interactive experiences. I blend artistic vision with technical expertise to create immersive digital environments and compelling visual narratives. With a passion for bringing ideas to life through cutting-edge technology and design.",
  skills: [
    "3D Modeling", "Animation", "Blender", "Maya", "Three.js", "WebGL",
    "React", "TypeScript", "Creative Coding", "GLSL", "Substance Painter",
    "UI/UX Design", "Motion Graphics", "Visual Effects", "Game Development", "AR/VR"
  ],
  projects: [
    {
      title: "Interactive 3D Office Environment",
      description: "Immersive portfolio experience featuring a detailed 3D office space with interactive elements and smooth navigation. Built using Three.js with custom lighting and material systems.",
      technologies: ["Three.js", "React", "TypeScript", "GLSL", "Blender"],
      liveUrl: "https://shainashultz.com"
    },
    {
      title: "3D Modeling & Animation Portfolio",
      description: "Comprehensive showcase of 3D modeling work including architectural visualizations, character design, and product renders. Features real-time rendering and interactive viewers.",
      technologies: ["Blender", "Substance Painter", "Three.js", "WebGL"],
      liveUrl: "https://shainashultz.com/3d-design"
    },
    {
      title: "WebGL Interactive Experiences",
      description: "Collection of interactive web experiences featuring custom shaders, particle systems, and immersive animations optimized for web performance.",
      technologies: ["WebGL", "GLSL", "Three.js", "React", "Creative Coding"]
    },
    {
      title: "AR Product Visualization",
      description: "Augmented reality application for product visualization enabling customers to view 3D models in their real environment using mobile devices.",
      technologies: ["AR.js", "Three.js", "WebXR", "React", "3D Modeling"]
    }
  ],
  experience: [
    {
      title: "3D Designer & Developer",
      company: "Freelance",
      period: "2021 - Present",
      description: "Creating custom 3D visualizations, interactive web experiences, and immersive environments for clients across various industries including architecture, gaming, and e-commerce."
    },
    {
      title: "Creative Developer",
      company: "Digital Agency",
      period: "2020 - 2021",
      description: "Developed interactive websites and digital experiences combining 3D graphics with modern web technologies. Collaborated with design teams to bring creative visions to life."
    },
    {
      title: "3D Artist",
      company: "Animation Studio",
      period: "2019 - 2020",
      description: "Specialized in 3D modeling, texturing, and animation for various projects including commercials, games, and architectural visualizations."
    }
  ],
  contact: {
    email: "hello@shainashultz.com",
    linkedin: "https://www.linkedin.com/in/shaina-shultz/",
    github: "github.com/shainashultz"
  }
};

export const usePortfolio = create<PortfolioState>((set) => ({
  currentSection: null,
  portfolioData: defaultPortfolioData,
  isLoading: false,

  setCurrentSection: (section) => {
    set({ currentSection: section });
  },

  initializePortfolio: () => {
    set({ isLoading: false });
    // Here you could fetch portfolio data from an API
    // For now, we're using the default data
  }
}));
