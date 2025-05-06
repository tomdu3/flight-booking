export const TopDestinations = () => {
    const destinations = [
      {
        id: 1,
        city: "Paris",
        country: "France",
        image: "/paris.jpg", 
        flights: "24 daily flights",
        price: "$299"
      },
      {
        id: 2,
        city: "Tokyo",
        country: "Japan",
        image: "/tokyo.jpg",
        flights: "18 daily flights",
        price: "$799"
      },
      {
        id: 3,
        city: "New York",
        country: "USA",
        image: "/new-york.jpg",
        flights: "32 daily flights",
        price: "$199"
      },
      {
        id: 4,
        city: "Rome",
        country: "Italy",
        image: "/rome.jpg",
        flights: "15 daily flights",
        price: "$349"
      }
    ];
  
    return (
      <section className="section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
          <div className="w-full bg-[var(--clr-card-background)]/70 backdrop-blur-md shadow-md rounded-xl mt-4 border border-[var(--clr-border)] p-6 md:p-10">
            <div className="text-center mb-12">
              <h2 className="section-title">Top Destinations</h2>
              <p className="section-subtitle">
                Explore our most popular destinations around the world
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((destination) => (
                <div key={destination.id} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-[var(--clr-border)]"> 
                  <img 
                    className="h-72 w-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    src={destination.image} 
                    alt={`${destination.city}, ${destination.country}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--clr-dark)] via-[var(--clr-dark)]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div> 
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-title font-bold mb-1">{destination.city}</h3>
                    <p className="text-sm font-text text-gray-300">{destination.country}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm font-text text-gray-300">{destination.flights}</p>
                      <p className="text-xl font-bold text-[var(--clr-primary)]">{destination.price}</p> 
                    </div>
                  </div>
                  <a 
                    href="#" 
                    className="absolute inset-0 z-10"
                    aria-label={`View flights to ${destination.city}`}
                  ></a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };