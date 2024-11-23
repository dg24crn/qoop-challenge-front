import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado para manejar el loading
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginErrorAlert = () => {
    Swal.fire("Invalid email or password. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Activar el estado de loading

    try {
      // Realizar la solicitud al endpoint de inicio de sesión
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        new URLSearchParams({ username: email, password: password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token } = response.data;
      console.log("Token recibido:", access_token);

      const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const userData = userResponse.data;
      console.log("Datos del usuario:", userData);

      login(
        {
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          isSubscribed: userData.is_subscribed,
        },
        access_token
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      loginErrorAlert();
    } finally {
      setLoading(false); // Desactivar el estado de loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Login</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-lg shadow-sm text-white ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <Link to="/register">
        <p className="text-center p-4 underline text-blue-600">Don't have an account?</p>
      </Link>
    </form>
  );
};

export default LoginForm;
