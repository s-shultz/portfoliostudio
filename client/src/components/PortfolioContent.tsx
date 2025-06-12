import { usePortfolio } from "../lib/stores/usePortfolio";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github, Mail, Linkedin, Phone } from "lucide-react";

export default function PortfolioContent() {
  const { currentSection, portfolioData } = usePortfolio();

  if (!currentSection) return null;

  const renderAbout = () => (
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-2xl">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <img
            src="/images/profile.jpg"
            alt="Shaina Shultz"
            className="w-24 h-24 rounded-full mr-6 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNjY2NzZhIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Im0yNSA3NWMwLTEzLjgwNyAxMS4xOTMtMjUgMjUtMjVzMjUgMTEuMTkzIDI1IDI1IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPgo=";
            }}
          />
          <div>
            <h2 className="text-3xl font-bold mb-2">{portfolioData.name}</h2>
            <p className="text-xl text-blue-300">{portfolioData.title}</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          {portfolioData.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {portfolioData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-400">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" size="sm" className="border-gray-500 text-white hover:bg-gray-700">
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </Button>
          <Button variant="outline" size="sm" className="border-gray-500 text-white hover:bg-gray-700">
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </Button>
          <Button variant="outline" size="sm" className="border-gray-500 text-white hover:bg-gray-700">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderProjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
      {portfolioData.projects.map((project, index) => (
        <Card key={index} className="bg-black/80 backdrop-blur-md border-gray-600 text-white">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3">{project.title}</h3>
            <p className="text-gray-300 mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, techIndex) => (
                <Badge key={techIndex} variant="outline" className="border-gray-500 text-gray-300">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              {project.liveUrl && (
                <Button variant="outline" size="sm" className="border-gray-500 text-white hover:bg-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" size="sm" className="border-gray-500 text-white hover:bg-gray-700">
                  <Github className="w-4 h-4 mr-2" />
                  Code
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderExperience = () => (
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-4xl">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">Professional Experience</h2>
        <div className="space-y-8">
          {portfolioData.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-blue-400 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{exp.title}</h3>
                <span className="text-blue-300 text-sm">{exp.period}</span>
              </div>
              <p className="text-blue-300 mb-3">{exp.company}</p>
              <p className="text-gray-300">{exp.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderContact = () => (
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-2xl">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
        <p className="text-gray-300 mb-6">
          I'm always interested in new opportunities and interesting projects. 
          Feel free to reach out if you'd like to work together!
        </p>

        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-blue-400" />
            <span>hello@shainashultz.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-blue-400" />
            <span>Available upon request</span>
          </div>
          <div className="flex items-center">
            <Linkedin className="w-5 h-5 mr-3 text-blue-400" />
            <span>linkedin.com/in/shainashultz</span>
          </div>
        </div>

        <div className="mt-8">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Mail className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'about':
        return renderAbout();
      case 'projects':
        return renderProjects();
      case 'experience':
        return renderExperience();
      case 'contact':
        return renderContact();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center p-4 z-10">
      <div className="pointer-events-auto">
        {renderContent()}
      </div>
    </div>
  );
}
