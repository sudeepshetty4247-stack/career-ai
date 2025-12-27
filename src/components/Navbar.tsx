import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "glass py-3" : "bg-transparent py-5"
    }`}>
      <div className="container px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">CareerAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("upload")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Upload
            </button>
            <button 
              onClick={() => scrollToSection("prediction")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Prediction
            </button>
            <button 
              onClick={() => scrollToSection("skills")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection("explainability")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Explainability
            </button>
            <button 
              onClick={() => scrollToSection("roadmap")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Roadmap
            </button>
          </div>

          {/* Auth/CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="default" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-32 truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="default" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button variant="hero" size="default" onClick={() => scrollToSection("upload")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass p-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection("upload")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Upload
              </button>
              <button 
                onClick={() => scrollToSection("prediction")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Prediction
              </button>
              <button 
                onClick={() => scrollToSection("skills")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Skills
              </button>
              <button 
                onClick={() => scrollToSection("explainability")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Explainability
              </button>
              <button 
                onClick={() => scrollToSection("roadmap")}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Roadmap
              </button>
              
              <div className="border-t border-border pt-4 mt-2">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <Button variant="outline" size="default" onClick={handleSignOut} className="w-full gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" size="default" onClick={() => { navigate('/auth'); setIsMobileMenuOpen(false); }} className="w-full">
                      Sign In
                    </Button>
                    <Button variant="hero" size="default" onClick={() => scrollToSection("upload")} className="w-full">
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
