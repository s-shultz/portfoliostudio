import { create } from "zustand";

export type PortfolioSection =
  | "about"
  | "projects"
  | "experience"
  | "contact"
  | null;

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
  name: "Shaina Shultz",
  title: "Design Technologist",
  bio: "Design Technologist specializing in Mixed Reality, AI Design, UI/UX Design, and Creative Coding. With professional experience at CitrusBits, Deloitte Digital, and as Founding Product Designer at Alchemy Vision, I create innovative digital experiences that bridge art and technology.",
  skills: [
    "Mixed Reality",
    "AR/VR Design",
    "AI Design",
    "Product Design",
    "Prototyping",
    "Information Architecture",
    "UI/UX Design",
    "3D Modeling and Animation",
    "Creative Coding",
    "Three.js",
    "Unity",
    "Unreal Engine",
    "Adobe Substance 3D",
    "Figma",
    "Adobe Creative Cloud",
    "Processing",
    "TouchDesigner",
    "JavaScript",
    "TypeScript",
    "P5.js",
    "HTML/CSS",
    "React",
  ],
  projects: [
    {
      title: "RadiusXR - Mixed Reality Vision Care",
      description:
        "Comprehensive VR interface design for patient onboarding and visual field testing procedures. Developed design system optimizing Figma workflows for team efficiency.",
      technologies: [
        "Figma",
        "VR Design",
        "Design Systems",
        "Mixed Reality",
        "Healthcare UX",
      ],
      liveUrl: "https://www.shainashultz.com/projects/radiusxr",
    },
    {
      title: "Fortune 500 Digital Experiences",
      description:
        "Designed responsive digital experiences for Amazon, American Express, Anthem Insurance, Bank of America, and NYU Langone at Deloitte Digital.",
      technologies: [
        "Figma",
        "Sketch",
        "InVision",
        "Responsive Design",
        "Enterprise UX",
      ],
      liveUrl: "https://www.shainashultz.com/projects/deloitte",
    },
    {
      title: "Alchemy Vision Product Design",
      description:
        "Founding Product Designer streamlining design-to-development handoff by 40%. Created comprehensive style guides and interactive prototypes.",
      technologies: [
        "Product Design",
        "Prototyping",
        "Design Systems",
        "User Research",
      ],
      liveUrl: "https://www.shainashultz.com/projects/alchemy",
    },
    {
      title: "Creative Coding Installations",
      description:
        "Interactive web experiences using Three.js, P5.js, and TouchDesigner for artistic expression and data visualization.",
      technologies: [
        "Three.js",
        "P5.js",
        "TouchDesigner",
        "WebGL",
        "Creative Coding",
      ],
      liveUrl: "https://www.shainashultz.com/creative-coding",
    },
  ],
  experience: [
    {
      title: "Contract Product Designer",
      company: "CitrusBits",
      period: "June 2024 - August 2024",
      description:
        "Designed user interfaces for mixed reality vision care applications including RadiusXR and IrisVision. Developed comprehensive design systems and conducted visual QA testing for accessibility and brand consistency.",
    },
    {
      title: "UX/Visual Designer",
      company: "Deloitte Digital",
      period: "September 2021 - May 2023",
      description:
        "Designed digital experiences for Fortune 500 clients including Amazon, American Express, Anthem Insurance, Bank of America, and NYU Langone. Built cloud and web applications using modern design tools and methodologies.",
    },
    {
      title: "Founding Product Designer",
      company: "Alchemy Vision",
      period: "October 2020 - October 2023",
      description:
        "Collaborated with CEO and creative teams to develop user flows, wireframes, and interactive prototypes. Streamlined design-to-development handoff by 40% through systematic design thinking and scalable solutions.",
    },
  ],
  contact: {
    email: "sshultz@smu.edu",
    phone: "818-219-9693",
    linkedin: "https://www.linkedin.com/in/shaina-shultz/",
    github: "https://www.shainashultz.com",
  },
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
  },
}));
