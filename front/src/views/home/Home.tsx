import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <Navbar />
      <div className="relative min-h-screen">
        {/* Imagen de fondo con efecto de blur */}
        <div
          className="absolute inset-0 bg-center bg-cover blur-md"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/originals/2e/e8/da/2ee8da273c077a9d170084d168cfe5ab.jpg')",
          }}
        ></div>

        {/* Contenido superpuesto */}
        <div className="relative flex flex-col items-center justify-center text-center min-h-screen py-16 px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white">
            Welcome to Managé
          </h1>
          <p className="text-lg md:text-2xl text-white mt-4">
            Your ultimate project management platform.
          </p>
          <Link to="/register">
            <button className="mt-8 py-2 px-6 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition duration-300">
              Start
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
