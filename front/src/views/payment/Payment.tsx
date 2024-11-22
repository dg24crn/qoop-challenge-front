import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Choose Your Plan</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Plan Mensual */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">PREMIUM (Monthly)</h2>
          <p className="text-gray-600 text-center mb-6">Unlock full access to all platform features.</p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li>✔️ Create and manage projects</li>
            <li>✔️ Assign tasks to team members</li>
            <li>✔️ Access external API</li>
          </ul>
          <p className="text-center text-2xl font-bold text-blue-600 mb-4">$4.99 / month</p>
          <button
            onClick={() => navigate("/pricing/payment/monthly")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Choose Monthly
          </button>
        </div>

        {/* Plan Anual */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">PREMIUM (Annually)</h2>
          <p className="text-gray-600 text-center mb-6">Unlock full access to all platform features.</p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li>✔️ Create and manage projects</li>
            <li>✔️ Assign tasks to team members</li>
            <li>✔️ Access external API</li>
          </ul>
          <p className="text-center text-2xl font-bold text-blue-600 mb-4">$49.99 / year</p>
          <button
            onClick={() => navigate("/pricing/payment/annually")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Choose Annually
          </button>
        </div>
      </div>

      {/* Back to Pricings Button */}
      <button
        onClick={() => navigate("/pricing")}
        className="mt-8 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
      >
        &lt; Back to Pricings
      </button>
    </div>
  );
};

export default PaymentSelection;
