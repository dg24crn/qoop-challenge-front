import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#E5E7EB] shadow-md py-4 border border-black">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Add Logo Later */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-900 text-lg font-bold hidden sm:block">
            Managé
          </span>
        </div>

        <h1 className="text-gray-800 text-xl font-semibold sm:hidden">
          Managé
        </h1>

        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
