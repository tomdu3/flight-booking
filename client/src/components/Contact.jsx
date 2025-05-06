import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export const Contact = () => {
    return (
      // Use standard section class and background color
      <section className="section flex flex-col items-center justify-center relative z-10" id="contact">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered section title and subtitle */}
          <h2 className="section-title !text-white" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>Get in Touch</h2>
          <p className="section-subtitle !text-white/90" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Have questions about booking your flight or need assistance? Reach out to us using the information below or send us a message directly.
          </p>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-start">
            {/* Contact Information Section */}
            <div className="mb-8 lg:mb-0">
              <div className="card p-8">
                <h3 className="text-2xl font-title font-bold text-[var(--clr-text)] mb-6">Contact Information</h3>
                <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 p-3 rounded-full bg-[var(--clr-primary)]/10">
                    <FaPhone className="h-6 w-6 text-[var(--clr-primary)]" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-title font-medium text-[var(--clr-text)]">Customer Support</h4>
                    <p className="text-base font-text text-[var(--clr-text-light)]">+44 7123-4567</p>
                    <p className="text-sm font-text text-[var(--clr-text-light)]">Available 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 p-3 rounded-full bg-[var(--clr-primary)]/10">
                    <FaEnvelope className="h-6 w-6 text-[var(--clr-primary)]" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-title font-medium text-[var(--clr-text)]">Email Us</h4>
                    <p className="text-base font-text text-[var(--clr-text-light)]">support@skyrace.com</p>
                    <p className="text-sm font-text text-[var(--clr-text-light)]">Replies within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 p-3 rounded-full bg-[var(--clr-primary)]/10">
                    <FaMapMarkerAlt className="h-6 w-6 text-[var(--clr-primary)]" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-title font-medium text-[var(--clr-text)]">Headquarters</h4>
                    <p className="text-base font-text text-[var(--clr-text-light)]">123 Uxbridge Road, Flat 3<br />W13 9AU, London</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Contact Form Section */}
            <div className="card p-8"> 
              <h3 className="text-2xl font-title font-bold text-[var(--clr-text)] mb-6">Send us a message</h3>
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-[var(--clr-border)] bg-[var(--clr-component-bg)] px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-[var(--clr-text-light)] hover:bg-[var(--clr-component-hover)] focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-all duration-300 outline-none shadow-sm"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-[var(--clr-border)] bg-[var(--clr-component-bg)] px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-[var(--clr-text-light)] hover:bg-[var(--clr-component-hover)] focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-all duration-300 outline-none shadow-sm"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full rounded-lg border border-[var(--clr-border)] bg-[var(--clr-component-bg)] px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-[var(--clr-text-light)] hover:bg-[var(--clr-component-hover)] focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-all duration-300 outline-none shadow-sm"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--clr-text)] mb-1.5">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full rounded-lg border border-[var(--clr-border)] bg-[var(--clr-component-bg)] px-4 py-2.5 text-base font-text text-[var(--clr-text)] placeholder-[var(--clr-text-light)] hover:bg-[var(--clr-component-hover)] focus:border-[var(--clr-primary)] focus:ring-1 focus:ring-[var(--clr-primary)] transition-all duration-300 outline-none shadow-sm resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-primary w-full text-lg font-title py-3 flex items-center justify-center"
                  >
                    Send Message
                     <FaPaperPlane className="w-4 h-4 ml-2.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  };
