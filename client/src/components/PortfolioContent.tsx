import { usePortfolio } from "../lib/stores/usePortfolio";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github, Mail, Linkedin, Phone } from "lucide-react";

export default function PortfolioContent() {
  const { currentSection, portfolioData } = usePortfolio();

  if (!currentSection) return null;

  const renderAbout = () => (
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-xl w-full max-h-[90vh] overflow-y-auto md:max-h-none md:overflow-visible">
      <CardContent className="p-3 sm:p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6">
          <img
            src="/profile.jpg"
            alt="Shaina Shultz"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 sm:mb-0 sm:mr-6 object-cover border-2 border-blue-400/30 flex-shrink-0"
            onError={(e) => {
              console.log('Profile image failed to load');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => console.log('Profile image loaded successfully')}
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{portfolioData.name}</h2>
            <p className="text-lg sm:text-xl text-blue-300">{portfolioData.title}</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
          {portfolioData.bio}
        </p>

        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
          {portfolioData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-400 text-xs sm:text-sm">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-500 text-white hover:bg-gray-700 transition-all duration-200 sm:hover:scale-105 text-xs sm:text-sm"
            onClick={() => window.location.href = `mailto:${portfolioData.contact.email}`}
          >
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Contact
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-500 text-white hover:bg-gray-700 transition-all duration-200 sm:hover:scale-105 text-xs sm:text-sm"
            onClick={() => window.open('https://www.linkedin.com/in/shaina-shultz/', '_blank')}
          >
            <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            LinkedIn
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-500 text-white hover:bg-gray-700 transition-all duration-200 sm:hover:scale-105 text-xs sm:text-sm"
            onClick={() => window.open('https://github.com/s-shultz', '_blank')}
          >
            <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-500 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:border-blue-400"
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Project
                </Button>
              )}
              {project.githubUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-500 text-white hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:border-blue-400"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
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
    <Card className="bg-black/80 backdrop-blur-md border-gray-600 text-white max-w-3xl w-full max-h-[90vh] overflow-y-auto md:max-h-none md:overflow-visible">
      <CardContent className="p-3 sm:p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
          <h2 className="text-base sm:text-lg font-bold">Professional Experience</h2>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 w-full sm:w-auto"
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
        
        <div className="mb-4 p-2 sm:p-3 bg-blue-900/20 rounded-lg border border-blue-600/30">
          <h3 className="text-xs sm:text-sm font-semibold mb-2">Education</h3>
          <div className="space-y-1 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-medium">Master of Arts in Creative Technology</span>
              <span className="text-blue-300 sm:ml-2">- Southern Methodist University (May 2025)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-medium">Bachelor of Science, Business Administration</span>
              <span className="text-blue-300 sm:ml-2">- Washington University in St. Louis</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-medium">Certificate in User Experience Design</span>
              <span className="text-blue-300 sm:ml-2">- UCLA</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-medium">Certificate in AI Products and Services</span>
              <span className="text-blue-300 sm:ml-2">- MIT</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {portfolioData.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-blue-400 pl-2 sm:pl-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                <h3 className="text-xs sm:text-sm font-semibold">{exp.title}</h3>
                <span className="text-blue-300 text-xs flex-shrink-0">{exp.period}</span>
              </div>
              <p className="text-blue-300 mb-1 text-xs">{exp.company}</p>
              <p className="text-gray-300 text-xs leading-relaxed">{exp.description}</p>
            </div>
          ))}
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
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center p-2 sm:p-4 sm:pl-24 sm:pr-4 z-30">
      <div className="pointer-events-auto w-full flex justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
