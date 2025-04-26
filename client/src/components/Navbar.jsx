export const Navbar = () => {
  return (
    <div className="py-4 flex justify-center items-center">
      <nav className="flex justify-between items-center w-[90%] h-12 md:h-16 px-4 py-2 bg-gray-100/70 backdrop-blur-sm shadow-xl rounded-xl"> 
        <div className="flex items-center font-title font-bold text-xl">
          Logo
        </div>
        
        <ul className="flex items-center gap-8">
          <li>
            <a href="#" className="text-lg font-title hover:text-blue-600 transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-lg font-title hover:text-blue-600 transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-lg font-title hover:text-blue-600 transition-colors">
              Contact
            </a>
          </li>
        </ul>
        
        <div className="flex items-center gap-6">
          <a href="#" className="font-title text-blue-600 hover:text-blue-800 transition-colors">
            Sign In
          </a>
          <a href="#" className="font-title text-gray-600 hover:text-black transition-colors">
            Sign Up
          </a>
          <a href="#" className="font-title text-gray-400 hover:text-gray-600 transition-colors">
            Sign Out
          </a>
        </div>
      </nav>
    </div>
  )
}