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
      <section className="section bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">Best Flight Offers</h2>
            <p className="section-subtitle">
              Discover our most popular flight routes at competitive prices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div key={offer.id} className="card">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img className="h-10 w-10 object-contain" src={offer.logo} alt={offer.airline} />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{offer.airline}</h3>
                      <p className="text-sm text-gray-500">{offer.stops}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{offer.departure}</p>
                      <p className="text-sm text-gray-500">{offer.departureTime}</p>
                    </div>
                    
                    <div className="text-center px-4">
                      <p className="text-xs text-gray-500">{offer.duration}</p>
                      <div className="relative mt-2">
                        <div className="border-t-2 border-gray-300 w-16"></div>
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{offer.arrival}</p>
                      <p className="text-sm text-gray-500">{offer.arrivalTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">{offer.date}</p>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--clr-primary)]">{offer.price}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4">
                  <button className="btn-primary w-full">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[var(--clr-primary)] bg-blue-100 hover:bg-blue-200 transition-colors duration-300">
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