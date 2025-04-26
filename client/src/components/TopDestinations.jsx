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
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Destinations</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most popular destinations around the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <div key={destination.id} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <img 
                  className="h-64 w-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  src={destination.image} 
                  alt={`${destination.city}, ${destination.country}`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">{destination.city}</h3>
                  <p className="text-gray-300">{destination.country}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-sm text-gray-300">{destination.flights}</p>
                    <p className="text-lg font-bold text-white">{destination.price}</p>
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
    );
  };