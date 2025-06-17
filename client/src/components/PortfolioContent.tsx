import { usePortfolio } from "../lib/stores/usePortfolio";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github, Mail, Linkedin, Phone } from "lucide-react";

export default function PortfolioContent() {
  const { currentSection, portfolioData } = usePortfolio();

  if (!currentSection) return null;

  const renderAbout = () => (
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-xl">
      <CardContent className="p-6">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
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
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-3xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Professional Experience</h2>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/Shultz_Shaina_Resume2025.pdf';
              link.download = 'Shultz_Shaina_Resume2025.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download Resume
          </Button>
        </div>
        
        <div className="mb-6 p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
          <h3 className="text-base font-semibold mb-2">Education</h3>
          <div className="space-y-1 text-xs">
            <div>
              <span className="font-medium">Master of Arts in Creative Technology</span>
              <span className="text-blue-300 ml-2">- Southern Methodist University (May 2025)</span>
            </div>
            <div>
              <span className="font-medium">Bachelor of Science, Business Administration</span>
              <span className="text-blue-300 ml-2">- Washington University in St. Louis</span>
            </div>
            <div>
              <span className="font-medium">Certificate in User Experience Design</span>
              <span className="text-blue-300 ml-2">- UCLA</span>
            </div>
            <div>
              <span className="font-medium">Certificate in AI Products and Services</span>
              <span className="text-blue-300 ml-2">- MIT</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {portfolioData.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-blue-400 pl-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold">{exp.title}</h3>
                <span className="text-blue-300 text-xs">{exp.period}</span>
              </div>
              <p className="text-blue-300 mb-2 text-sm">{exp.company}</p>
              <p className="text-gray-300 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderContact = () => (
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
        <p className="text-gray-300 mb-6">
          I'm always interested in new opportunities and interesting projects. 
          Feel free to reach out if you'd like to work together!
        </p>

        <div className="space-y-4">
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-blue-400" />
            <span>{portfolioData.contact.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-blue-400" />
            <span>{portfolioData.contact.phone}</span>
          </div>
          <div className="flex items-center">
            <Linkedin className="w-5 h-5 mr-3 text-blue-400" />
            <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
              linkedin.com/in/shaina-shultz
            </a>
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
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center pl-24 pr-4 py-4 z-30">
      <div className="pointer-events-auto">
        {renderContent()}
      </div>
    </div>
  );
}
