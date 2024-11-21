import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Realizar la solicitud al endpoint de inicio de sesión
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        new URLSearchParams({ username: email, password: password }), // Enviar como form-urlencoded
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token } = response.data;
      console.log("Token recibido:", access_token); // Log del token recibido

      // Realizar la solicitud para obtener los datos del usuario
      const userResponse = await axios.get("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const userData = userResponse.data;
      console.log("Datos del usuario:", userData); // Log de los datos del usuario

      // Iniciar sesión con los datos del usuario
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
      console.error("Error durante el inicio de sesión:", error); // Log del error
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Login</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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
        <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Login
      </button>
      <Link to="/register">
        <p className="text-center p-4 underline text-blue-600">Don't have an account?</p>
      </Link>
    </form>
  );
};

export default LoginForm;
