import { FaPlaneDeparture, FaPlaneArrival, FaClock, FaCalendarAlt } from 'react-icons/fa'; // Import icons

export const FlightOffers = () => {
    const offers = [
      {
        id: 1,
        airline: "SkyWings",
        logo: "/skywings-logo.png", 
        departure: "JFK",
        arrival: "LHR",
        departureTime: "08:30 AM",
        arrivalTime: "09:45 PM",
        duration: "7h 15m",
        price: "$489",
        stops: "Non-stop",
        date: "Jun 15, 2023"
      },
      {
        id: 2,
        airline: "Oceanic",
        logo: "/oceanic-logo.png",
        departure: "LAX",
        arrival: "CDG",
        departureTime: "11:20 AM",
        arrivalTime: "07:15 AM",
        duration: "10h 55m",
        price: "$612",
        stops: "1 stop",
        date: "Jun 18, 2023"
      },
      {
        id: 3,
        airline: "Global Air",
        logo: "/global-air-logo.png",
        departure: "ORD",
        arrival: "DXB",
        departureTime: "03:45 PM",
        arrivalTime: "05:30 PM",
        duration: "14h 45m",
        price: "$899",
        stops: "1 stop",
        date: "Jun 20, 2023"
      }
    ];
  
    return (
      <section className="section">
        {/* Use consistent container like Navbar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
          {/* Apply Navbar styling: bg, blur, shadow, rounded, border, margin, padding */} 
          <div className="w-full bg-[var(--clr-card-background)]/70 backdrop-blur-md shadow-md rounded-xl mt-4 border border-[var(--clr-border)] p-6 md:p-10">
            <div className="text-center mb-12">
              <h2 className="section-title">Best Flight Offers</h2>
              <p className="section-subtitle">
                Discover our most popular flight routes at competitive prices
              </p>
            </div>
            
            {/* Keep original grid for offers, but cards will now use a slightly different background */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                // Use a solid card background for contrast within the blurred section
                <div key={offer.id} className="card bg-[var(--clr-card-background)] flex flex-col"> 
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-6">
                      <img className="h-12 w-12 object-contain rounded-full ring-1 ring-[var(--clr-border)] p-1" src={offer.logo} alt={offer.airline} /> 
                      <div className="ml-4">
                        <h3 className="text-xl font-title font-semibold text-[var(--clr-text)]">{offer.airline}</h3> 
                        <p className="text-sm font-text text-[var(--clr-text-light)]">{offer.stops}</p> 
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[var(--clr-text)]">{offer.departure}</p> 
                        <p className="text-sm font-text text-[var(--clr-text-light)]">{offer.departureTime}</p> 
                      </div>
                      
                      <div className="flex flex-col items-center px-4">
                        <FaClock className="h-5 w-5 text-[var(--clr-text-light)] mb-1" /> 
                        <p className="text-xs font-mono text-[var(--clr-text-light)]">{offer.duration}</p> 
                        <div className="border-t-2 border-[var(--clr-border)] w-16 mt-2"></div> 
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[var(--clr-text)]">{offer.arrival}</p> 
                        <p className="text-sm font-text text-[var(--clr-text-light)]">{offer.arrivalTime}</p> 
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-[var(--clr-border)]"> 
                      <div className="flex items-center text-sm font-text text-[var(--clr-text-light)]"> 
                         <FaCalendarAlt className="h-4 w-4 mr-1 text-[var(--clr-text-light)]" /> 
                         {offer.date}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[var(--clr-primary)]">{offer.price}</p> 
                        <p className="text-xs font-text text-[var(--clr-text-light)]">per person</p> 
                      </div>
                    </div>
                  </div>
                  
                  {/* Slightly adjust button background if needed for contrast */}
                  <div className="bg-[var(--clr-background)] px-6 py-4 rounded-b-xl"> 
                    <button className="btn-primary w-full text-lg font-title py-3">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <button className="btn-outline-primary inline-flex items-center px-8 py-4 text-lg font-title">
                View All Offers
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };