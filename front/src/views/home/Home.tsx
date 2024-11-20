import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center min-h-screen py-16 px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800">
          Welcome to Managé
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mt-4">
          Your ultimate project management platform.
        </p>
        <Link to="/register">
          <button className="mt-8 py-2 px-6 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition duration-300">
            Start
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
