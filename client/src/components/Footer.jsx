import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className='bg-[var(--clr-secondary)] text-gray-100 pt-12 pb-8 font-text'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10'>
          {/* Company Info */}
          <div className='lg:col-span-2 pr-8'>
            <h3 className='text-3xl font-title font-extrabold text-white mb-4'>
              Sky<span className='text-[var(--clr-primary)]'>Race</span>
            </h3>
            <p className='mb-6 text-gray-200'>
              Making travel simple, affordable, and accessible for everyone
              around the world.
            </p>
            <div className='flex space-x-6'>
              <a
                href='#'
                className='text-gray-300 hover:text-[var(--clr-primary)] transition-colors duration-300'
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-[var(--clr-primary)] transition-colors duration-300'
                aria-label="Twitter"
              >
                <FaXTwitter size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-[var(--clr-primary)] transition-colors duration-300'
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-[var(--clr-primary)] transition-colors duration-300'
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href='#'
                className='text-gray-300 hover:text-[var(--clr-primary)] transition-colors duration-300'
                aria-label="YouTube"
              >
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-xl font-title font-semibold text-white mb-4'>
              Quick Links
            </h4>
            <ul className='space-y-3 text-gray-200'>
              <li>
                <Link
                  to='/about'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/flights'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300'
                >
                  Flights
                </Link>
              </li>
              <li>
                <Link
                  to='/destinations'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300'
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to='/deals'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300'
                >
                  Special Deals
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='hover:text-[var(--clr-primary)] transition-colors duration-300'
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-xl font-title font-semibold text-white mb-4'>
              Contact Us
            </h4>
            <ul className='space-y-4 text-gray-200'>
              <li className='flex items-start'>
                <MdLocationOn className='mt-1 mr-3 flex-shrink-0 text-[var(--clr-primary)]' size={20} />
                <span>123 Uxbridge Road, Flat 3, W13 9AU</span>
              </li>
              <li className='flex items-center'>
                <MdPhone className='mr-3 text-[var(--clr-primary)]' size={20} />
                <span>+44 7123-4567</span>
              </li>
              <li className='flex items-center'>
                <MdEmail className='mr-3 text-[var(--clr-primary)]' size={20} />
                <span>info@skyrace.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className='mb-8 md:w-full lg:w-[400px] mx-auto'>
          <h4 className='text-xl font-title font-semibold text-white mb-4 text-center'>
            Subscribe to our Newsletter
          </h4>
          <div className='flex flex-col sm:flex-row gap-3'>
            <input
              type='email'
              placeholder='Your email address'
              className='flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--clr-primary)] transition-colors duration-300' // Refined input styles
            />
            <button className='btn-primary px-6 py-3 font-title text-lg'>
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm text-gray-300 mb-4 md:mb-0'>
            &copy; {new Date().getFullYear()} SkyRace. All rights reserved.
          </p>
          <div className='flex space-x-6 text-gray-300'>
            <Link
              to='/privacy'
              className='hover:text-[var(--clr-primary)] transition-colors duration-300'
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms'
              className='hover:text-[var(--clr-primary)] transition-colors duration-300'
            >
              Terms of Service
            </Link>
            <Link
              to='/cookies'
              className='hover:text-[var(--clr-primary)] transition-colors duration-300'
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
