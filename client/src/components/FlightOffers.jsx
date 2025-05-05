import { FaPlaneDeparture, FaPlaneArrival, FaClock, FaCalendarAlt } from 'react-icons/fa'; // Import icons

export const FlightOffers = () => {
    const offers = [
      {
        id: 1,
        airline: "SkyWings",
        logo: "/skywings-logo.png", // Make sure these logos exist in the public folder
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
      <section className="section bg-[var(--clr-background)]"> {/* Use background color variable */} 
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            {/* Section title and subtitle classes already use the new colors from App.css */}
            <h2 className="section-title">Best Flight Offers</h2>
            <p className="section-subtitle">
              Discover our most popular flight routes at competitive prices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div key={offer.id} className="card flex flex-col"> {/* Use the card class and flex column (card class uses color variables) */} 
                <div className="p-6 flex-grow">
                  <div className="flex items-center mb-6">
                    {/* Make sure airline logos are in the public directory */}
                    <img className="h-12 w-12 object-contain rounded-full ring-1 ring-[var(--clr-border)] p-1" src={offer.logo} alt={offer.airline} /> {/* Use border color variable */} 
                    <div className="ml-4">
                      <h3 className="text-xl font-title font-semibold text-[var(--clr-text)]">{offer.airline}</h3> {/* Use text color variable */} 
                      <p className="text-sm font-text text-[var(--clr-text-light)]">{offer.stops}</p> {/* Use lighter text color variable */} 
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[var(--clr-text)]">{offer.departure}</p> {/* Use text color variable */} 
                      <p className="text-sm font-text text-[var(--clr-text-light)]">{offer.departureTime}</p> {/* Use lighter text color variable */} 
                    </div>
                    
                    <div className="flex flex-col items-center px-4">
                      <FaClock className="h-5 w-5 text-[var(--clr-text-light)] mb-1" /> {/* Use lighter text color for icon */} 
                      <p className="text-xs font-mono text-[var(--clr-text-light)]">{offer.duration}</p> {/* Use lighter text color variable */} 
                      <div className="border-t-2 border-[var(--clr-border)] w-16 mt-2"></div> {/* Use border color variable */} 
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[var(--clr-text)]">{offer.arrival}</p> {/* Use text color variable */} 
                      <p className="text-sm font-text text-[var(--clr-text-light)]">{offer.arrivalTime}</p> {/* Use lighter text color variable */} 
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-[var(--clr-border)]"> {/* Use border color variable */} 
                    <div className="flex items-center text-sm font-text text-[var(--clr-text-light)]"> {/* Use lighter text color variable */} 
                       <FaCalendarAlt className="h-4 w-4 mr-1 text-[var(--clr-text-light)]" /> {/* Use lighter text color for icon */} 
                       {offer.date}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[var(--clr-primary)]">{offer.price}</p> {/* Use primary color variable */} 
                      <p className="text-xs font-text text-[var(--clr-text-light)]">per person</p> {/* Use lighter text color variable */} 
                    </div>
                  </div>
                </div>
                
                <div className="bg-[var(--clr-background)] px-6 py-4"> {/* Use background color variable */} 
                  {/* Using btn-primary class */} 
                  <button className="btn-primary w-full text-lg font-title py-3">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            {/* Using btn-outline-primary class */} 
            <button className="btn-outline-primary inline-flex items-center px-8 py-4 text-lg font-title">
              View All Offers
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    );
  };