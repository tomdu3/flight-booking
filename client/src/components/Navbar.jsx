import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="py-4 flex justify-center items-center">
      <nav className="flex justify-between items-center w-[90%] h-12 md:h-16 px-4 py-2 bg-gray-100/70 backdrop-blur-sm shadow-xl rounded-xl">
        {/* Logo */}
        <div className="flex items-center font-title font-bold text-xl">
          Logo
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            <li>
              <a href="#" className="text-lg font-title hover:text-blue-600 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-lg font-title hover:text-blue-600 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-lg font-title hover:text-blue-600 transition-colors">
                Contact
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-6">
            <a href="#" className="font-title text-blue-600 hover:text-blue-800 transition-colors">
              Sign In
            </a>
            <a href="#" className="font-title text-gray-600 hover:text-black transition-colors">
              Sign Up
            </a>
            <a href="#" className="font-title text-gray-400 hover:text-gray-600 transition-colors">
              Sign Out
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-24 left-0 right-0 bg-gray-100/95 backdrop-blur-sm shadow-lg mx-4 rounded-xl z-50 py-4 px-6">
            <ul className="flex flex-col items-center gap-6">
              <li>
                <a 
                  href="#" 
                  className="text-lg font-title hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-lg font-title hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-lg font-title hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </a>
              </li>
              <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-300 w-full">
                <a 
                  href="#" 
                  className="font-title text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </a>
                <a 
                  href="#" 
                  className="font-title text-gray-600 hover:text-black transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </a>
                <a 
                  href="#" 
                  className="font-title text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Out
                </a>
              </div>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};