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

// Default portfolio data - replace with actual content
const defaultPortfolioData: PortfolioData = {
  name: "Shaina Schultz",
  title: "Full Stack Developer & Designer",
  bio: "Passionate full-stack developer with expertise in modern web technologies. I create beautiful, functional applications that solve real-world problems. With a strong background in both frontend and backend development, I enjoy tackling complex challenges and bringing ideas to life through code.",
  skills: [
    "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB",
    "AWS", "Docker", "Three.js", "Next.js", "Express", "GraphQL",
    "UI/UX Design", "Figma", "Git", "CI/CD"
  ],
  projects: [
    {
      title: "3D Portfolio Website",
      description: "An immersive 3D portfolio experience built with Three.js and React. Features interactive office environment with portfolio content integration.",
      technologies: ["React", "Three.js", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://shainashultz.com",
      githubUrl: "https://github.com/shaina/portfolio"
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with advanced features including inventory management, payment processing, and analytics dashboard.",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      liveUrl: "https://example-store.com",
      githubUrl: "https://github.com/shaina/ecommerce"
    },
    {
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates, team collaboration features, and advanced reporting capabilities.",
      technologies: ["React", "Express", "MongoDB", "Socket.io", "Redux"],
      liveUrl: "https://taskmaster-app.com",
      githubUrl: "https://github.com/shaina/taskmaster"
    },
    {
      title: "Data Visualization Dashboard",
      description: "Interactive dashboard for complex data analysis with customizable charts, real-time updates, and export functionality.",
      technologies: ["Vue.js", "D3.js", "Python", "FastAPI", "PostgreSQL"],
      liveUrl: "https://dataviz-dashboard.com",
      githubUrl: "https://github.com/shaina/dataviz"
    }
  ],
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovation Co.",
      period: "2022 - Present",
      description: "Leading development of large-scale web applications, mentoring junior developers, and architecting scalable solutions using modern technologies."
    },
    {
      title: "Frontend Developer",
      company: "Digital Solutions Inc.",
      period: "2020 - 2022",
      description: "Developed responsive web applications using React and Vue.js, collaborated with design teams to implement pixel-perfect UIs, and optimized application performance."
    },
    {
      title: "Junior Web Developer",
      company: "StartUp Ventures",
      period: "2019 - 2020",
      description: "Built and maintained company websites, implemented new features, and gained experience with full-stack development technologies."
    }
  ],
  contact: {
    email: "hello@shainashultz.com",
    linkedin: "linkedin.com/in/shainashultz",
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
