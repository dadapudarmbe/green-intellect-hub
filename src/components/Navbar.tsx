
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Leaf, BarChart3, Map, Camera, LogIn, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Leaf className="h-4 w-4 mr-2" /> },
    { name: 'Classify', path: '/classify', icon: <Camera className="h-4 w-4 mr-2" /> },
    { name: 'Energy', path: '/energy', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { name: 'Recycling', path: '/map', icon: <Map className="h-4 w-4 mr-2" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary animate-pulse-soft" />
          <span className="font-medium text-xl">EcoSmartHub</span>
        </Link>

        {isMobile ? (
          <>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-lg animate-fade-in">
                <nav className="flex flex-col items-center justify-center h-full">
                  <ul className="flex flex-col items-center space-y-8">
                    {navLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={cn(
                            'flex items-center text-lg py-2 px-4 rounded-md transition-colors',
                            location.pathname === link.path
                              ? 'text-primary font-medium'
                              : 'text-foreground/70 hover:text-foreground'
                          )}
                        >
                          {link.icon}
                          {link.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/login"
                        className="flex items-center text-lg py-2 px-4 rounded-md transition-colors text-foreground/70 hover:text-foreground"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center">
            <ul className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      'flex items-center text-sm py-2 px-3 rounded-md transition-colors',
                      location.pathname === link.path
                        ? 'text-primary font-medium'
                        : 'text-foreground/70 hover:text-foreground'
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="h-6 w-px bg-border mx-4" />
            <Link
              to="/login"
              className="flex items-center text-sm py-2 px-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
