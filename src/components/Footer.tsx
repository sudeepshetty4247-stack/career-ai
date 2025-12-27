import { Brain, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">CareerAI</span>
          </div>

          {/* Built by */}
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-medium text-foreground">
              Built by Sudesh, Sudeep, Shankar & Vipin
            </span>
            <span className="text-xs text-muted-foreground">
              Career Intelligence System • ML & Explainable AI
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Github className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </a>
            <a href="#" className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </a>
            <a href="#" className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Mail className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
