import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className='bg-[var(--clr-secondary)] text-gray-300 pt-12 pb-6'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
          {/* Company Info */}
          <div className='lg:col-span-2'>
            <h3 className='text-2xl font-bold text-white mb-4'>
              Sky<span className='text-[var(--clr-primary)]'>Race</span>
            </h3>
            <p className='mb-4'>
              Making travel simple, affordable, and accessible for everyone
              around the world.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <FaFacebook size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <FaInstagram size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors'
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-white font-semibold text-lg mb-4'>
              Quick Links
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/about'
                  className='hover:text-white transition-colors'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/flights'
                  className='hover:text-white transition-colors'
                >
                  Flights
                </Link>
              </li>
              <li>
                <Link
                  to='/destinations'
                  className='hover:text-white transition-colors'
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to='/deals'
                  className='hover:text-white transition-colors'
                >
                  Special Deals
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='hover:text-white transition-colors'
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-white font-semibold text-lg mb-4'>
              Contact Us
            </h4>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <MdLocationOn className='mt-1 mr-2 flex-shrink-0' />
                <span>123 Uxbridge Road, Flat 3, W13 9AU</span>
              </li>
              <li className='flex items-center'>
                <MdPhone className='mr-2' />
                <span>+44 7123-4567</span>
              </li>
              <li className='flex items-center'>
                <MdEmail className='mr-2' />
                <span>info@skyrace.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className='mb-8 md:w-[500px]'>
          <h4 className='text-white font-semibold text-lg mb-4'>
            Subscribe to our Newsletter
          </h4>
          <div className='flex flex-col sm:flex-row gap-2'>
            <input
              type='email'
              placeholder='Your email address'
              className='flex-grow px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--clr-primary)]'
            />
            <button className='bg-[var(--clr-primary)] hover:bg-[var(--clr-primary-hover)] text-white px-6 py-2 rounded transition-colors'>
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm text-gray-500 mb-4 md:mb-0'>
            &copy; {new Date().getFullYear()} SkyRace. All rights reserved.
          </p>
          <div className='flex space-x-6'>
            <Link
              to='/privacy'
              className='text-sm hover:text-white transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms'
              className='text-sm hover:text-white transition-colors'
            >
              Terms of Service
            </Link>
            <Link
              to='/cookies'
              className='text-sm hover:text-white transition-colors'
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
