import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="relative z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <nav className="flex justify-between items-center py-3 md:py-4 bg-[var(--clr-card-background)]/70 backdrop-blur-md shadow-md rounded-xl mt-4 border border-[var(--clr-border)] px-6"> 
          {/* Logo */}
          <div className="flex items-center font-title font-extrabold text-2xl text-[var(--clr-primary)]">
            SkyRace
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8"> 
            <ul className="flex items-center gap-8"> 
              <li>
                <Link to="/" className="text-lg font-title text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors duration-300 px-3 py-2">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-lg font-title text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors duration-300 px-3 py-2">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-lg font-title text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors duration-300 px-3 py-2">
                  Contact
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-3"> 
              <button className="btn-outline-primary font-title px-4 py-2">
                Sign In
              </button>
              <button className="btn-primary font-title px-4 py-2">
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-[var(--clr-text)] focus:outline-none p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--clr-card-background)]/70 backdrop-blur-md shadow-lg mx-4 rounded-b-xl z-50 py-4 px-6 origin-top animate-open-menu border border-t-0 border-[var(--clr-border)]">
            <ul className="flex flex-col items-center gap-4"> 
              <li>
                <Link
                  to="/"
                  className="text-lg font-title text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors duration-300 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-lg font-title text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors duration-300 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-lg font-title text-[var(--clr-text)] hover:text-[var(--clr-primary)] transition-colors duration-300 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-[var(--clr-border)] w-full mt-4">
                <button
                  className="btn-outline-primary font-title w-full py-3"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </button>
                <button
                  className="btn-primary font-title w-full py-3"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </button>
              </div>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
