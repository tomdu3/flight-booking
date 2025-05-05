import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'; // Import icons

export const Contact = () => {
    return (
      // Removed problematic comment that was causing a syntax error
      <section className="section bg-[var(--clr-background)]" id="contact">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Contact Information */}
            <div className="mb-12 lg:mb-0 lg:pr-8">
              {/* Section title and subtitle classes already use the new colors from App.css */}
              <h2 className="section-title text-left">Contact Us</h2> 
              <p className="text-lg font-text text-[var(--clr-text)] mb-10">
                Have questions about your upcoming trip? Our team is here to help you 24/7.
              </p>
              
              <div className="space-y-8">
                {/* Phone */} 
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaPhone className="h-6 w-6 text-[var(--clr-primary)]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-title font-semibold text-[var(--clr-text)]">Customer Support</h3>
                    <p className="text-base font-text text-[var(--clr-text-light)]">+44 7123-4567</p>
                  </div>
                </div>
                
                {/* Email */} 
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaEnvelope className="h-6 w-6 text-[var(--clr-primary)]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-title font-semibold text-[var(--clr-text)]">Email Us</h3>
                    <p className="text-base font-text text-[var(--clr-text-light)]">support@skyrace.com</p>
                  </div>
                </div>
                
                {/* Address */} 
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="h-6 w-6 text-[var(--clr-primary)]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-title font-semibold text-[var(--clr-text)]">Headquarters</h3>
                    <p className="text-base font-text text-[var(--clr-text-light)]">123 Uxbridge Road, Flat 3<br />W13 9AU</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */} 
            <div className="card p-6 sm:p-8 bg-[var(--clr-card-background)]"> 
              <h3 className="text-2xl font-title font-bold text-[var(--clr-dark)] mb-8">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--clr-text)] mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full rounded-lg border border-[var(--clr-border)] px-4 py-3 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--clr-text)] mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full rounded-lg border border-[var(--clr-border)] px-4 py-3 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[var(--clr-text)] mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full rounded-lg border border-[var(--clr-border)] px-4 py-3 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--clr-text)] mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full rounded-lg border border-[var(--clr-border)] px-4 py-3 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <div>
                  {/* Using btn-primary class */}
                  <button 
                    type="submit" 
                    className="btn-primary w-full text-lg font-title py-3 flex items-center justify-center" 
                  >
                    Send Message
                     <FaPaperPlane className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  };