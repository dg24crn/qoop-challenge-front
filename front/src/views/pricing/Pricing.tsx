import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { user, token, checkSession } = useAuth();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleDowngrade = async () => {
    try {
      if (!user || !token) return;

      // Llamar al endpoint para cambiar la suscripción a free
      await axios.post(
        `http://127.0.0.1:8000/users/${user.id}/unsubscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar los datos del usuario
      await checkSession();
      alert("Subscription downgraded to Free successfully.");
    } catch (error) {
      console.error("Error downgrading subscription:", error);
      alert("There was an error downgrading your subscription.");
    }
  };

  const handleUpgradeToPremium = () => {
    navigate("/pricing/payment");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Pick your Plan
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Free Plan Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-80 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">FREE</h2>
          <p className="text-gray-600 text-center mb-6">
            Perfect for getting started with basic features.
          </p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li>✔️ View projects and tasks</li>
            <li>❌ Cannot create or manage projects</li>
            <li>❌ No external API access</li>
          </ul>
          {user?.isSubscribed ? (
            <button
              onClick={handleDowngrade}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Downgrade to Free
            </button>
          ) : (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              disabled
            >
              Current Plan
            </button>
          )}
        </div>

        {/* Premium Plan Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-80 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">PREMIUM</h2>
          <p className="text-gray-600 text-center mb-6">
            Unlock full access to all platform features.
          </p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li>✔️ Create and manage projects</li>
            <li>✔️ Assign tasks to team members</li>
            <li>✔️ Access external API</li>
          </ul>
          {/* Precio del Plan */}
          <p className="text-xl font-bold text-gray-800 mb-4">$4.99 / m</p>
          {user?.isSubscribed ? (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              disabled
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={handleUpgradeToPremium}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <button
        onClick={handleBackToDashboard}
        className="mt-8 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
      >
        &lt; Back to Dashboard
      </button>
    </div>
  );
};

export default Pricing;
