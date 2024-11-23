import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const Annually: React.FC = () => {
  const { user, token, checkSession } = useAuth();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [isValid, setIsValid] = useState(false);
  const payAlert = () => {
    Swal.fire("Payment successful! You are now subscribed to the Annual Plan.")
  }
  const payErrorAlert = () => {
    Swal.fire("There was an error processing your payment. Please try again.")
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    setCardNumber(value.replace(/(\d{4})(?=\d)/g, "$1 "));
  };

  const validateCard = () => {
    const isCardNumberValid = cardNumber.replace(/\s/g, "").length === 16;
    const isExpiryMonthValid =
      expiryMonth.length === 2 && Number(expiryMonth) >= 1 && Number(expiryMonth) <= 12;
    const isExpiryYearValid = expiryYear.length === 2 && /^\d{2}$/.test(expiryYear);
    const isCvvValid = cvv.length === 3 && /^\d+$/.test(cvv);

    setIsValid(isCardNumberValid && isExpiryMonthValid && isExpiryYearValid && isCvvValid);
  };

  const handlePayNow = async () => {
    if (!user || !token) return;

    try {
      //* Llamar al endpoint para activar la suscripción anual
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/subscribe/annually`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //* Actualizar la sesión del usuario
      await checkSession();
      payAlert()
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during payment:", error);
      payErrorAlert()
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Premium Plan - Annually</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Información del plan */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">PREMIUM</h2>
          <p className="text-gray-600 text-center mb-6">Full access to all platform features.</p>
          <ul className="mb-6 space-y-2 text-sm text-gray-700">
            <li>✔️ Create and manage projects</li>
            <li>✔️ Assign tasks to team members</li>
            <li>✔️ Access external API</li>
          </ul>
          <p className="text-center text-2xl font-bold text-blue-600">$49.99 / year</p>
        </div>

        {/* Formulario de pago */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Payment Details</h3>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="cardNumber" className="block text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                onBlur={validateCard}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label htmlFor="expiryMonth" className="block text-gray-700 mb-2">
                  Expiry Month
                </label>
                <input
                  type="text"
                  id="expiryMonth"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  onBlur={validateCard}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="MM"
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="expiryYear" className="block text-gray-700 mb-2">
                  Expiry Year
                </label>
                <input
                  type="text"
                  id="expiryYear"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  onBlur={validateCard}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="YY"
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  onBlur={validateCard}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handlePayNow}
              disabled={!isValid}
              className={`w-full py-2 mt-4 text-white rounded-lg ${
                isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>

      {/* Botón para volver a opciones de pago */}
      <button
        onClick={() => navigate("/pricing/payment")}
        className="mt-8 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
      >
        &lt; Back to Payment Options
      </button>
    </div>
  );
};

export default Annually;
