import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className='bg-[var(--clr-secondary)] text-[var(--clr-light)] pt-12 pb-8 font-text'> {/* Use secondary background, light text color, and text font */} 
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10'> {/* Increased gap and bottom margin */} 
          {/* Company Info */}
          <div className='lg:col-span-2 pr-8'> {/* Added right padding on large screens */} 
            <h3 className='text-3xl font-title font-extrabold text-white mb-4'> {/* Larger, bolder title with white color */} 
              Sky<span className='text-[var(--clr-primary)]'>Race</span>
            </h3>
            <p className='mb-6 text-gray-300'> {/* Increased bottom margin and slightly lighter gray text */} 
              Making travel simple, affordable, and accessible for everyone
              around the world.
            </p>
            <div className='flex space-x-6'> {/* Increased space between icons */} 
              <a
                href='#'
                className='text-gray-400 hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                aria-label="Facebook"
              >
                <FaFacebook size={24} /> {/* Larger icons */} 
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                aria-label="Twitter"
              >
                <FaXTwitter size={24} /> {/* Larger icons */} 
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                aria-label="Instagram"
              >
                <FaInstagram size={24} /> {/* Larger icons */} 
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} /> {/* Larger icons */} 
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                aria-label="YouTube"
              >
                <FaYoutube size={24} /> {/* Larger icons */} 
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-xl font-title font-semibold text-white mb-4'> {/* Title font, larger size, white color */} 
              Quick Links
            </h4>
            <ul className='space-y-3 text-gray-300'> {/* Increased space and slightly lighter gray text */} 
              <li>
                <Link
                  to='/about'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/flights'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                >
                  Flights
                </Link>
              </li>
              <li>
                <Link
                  to='/destinations'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to='/deals'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                >
                  Special Deals
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-xl font-title font-semibold text-white mb-4'> {/* Title font, larger size, white color */} 
              Contact Us
            </h4>
            <ul className='space-y-4 text-gray-300'> {/* Increased space and slightly lighter gray text */} 
              <li className='flex items-start'>
                <MdLocationOn className='mt-1 mr-3 flex-shrink-0 text-[var(--clr-primary)]' size={20} /> {/* Icon with primary color and size */} 
                <span>123 Uxbridge Road, Flat 3, W13 9AU</span>
              </li>
              <li className='flex items-center'>
                <MdPhone className='mr-3 text-[var(--clr-primary)]' size={20} /> {/* Icon with primary color and size */} 
                <span>+44 7123-4567</span>
              </li>
              <li className='flex items-center'>
                <MdEmail className='mr-3 text-[var(--clr-primary)]' size={20} /> {/* Icon with primary color and size */} 
                <span>info@skyrace.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className='mb-8 md:w-full lg:w-[400px] mx-auto'> {/* Centered and adjusted width */} 
          <h4 className='text-xl font-title font-semibold text-white mb-4 text-center'> {/* Centered text */} 
            Subscribe to our Newsletter
          </h4>
          <div className='flex flex-col sm:flex-row gap-3'> {/* Increased gap */} 
            <input
              type='email'
              placeholder='Your email address'
              className='flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--clr-primary)] transition-colors duration-300' // Refined input styles
            />
            <button className='btn-primary px-6 py-3 font-title text-lg'> {/* Applied btn-primary and adjusted padding/font */} 
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center'> {/* Lighter border */} 
          <p className='text-sm text-gray-400 mb-4 md:mb-0'> {/* Slightly lighter gray text */} 
            &copy; {new Date().getFullYear()} SkyRace. All rights reserved.
          </p>
          <div className='flex space-x-6 text-gray-400'> {/* Slightly lighter gray text */} 
            <Link
              to='/privacy'
              className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms'
              className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
            >
              Terms of Service
            </Link>
            <Link
              to='/cookies'
              className='hover:text-[var(--clr-primary)] transition-colors duration-300' // Hover primary color
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
