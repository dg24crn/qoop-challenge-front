import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import NasaApod from "../../apis/NasaApod";
import TeamMembers from "./TeamMembers";
import Members from "./Members";

const Sidebar: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [subscriptionExpiration, setSubscriptionExpiration] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false); // Estado para mostrar el mensaje "Copied"

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user || !token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/${user.id}/subscription-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubscriptionExpiration(response.data.subscription_expiration);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    if (user?.isSubscribed) {
      fetchSubscriptionStatus();
    }
  }, [user, token]);

  // Función para copiar el ID al portapapeles
  const handleCopyID = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString()).then(() => {
        setShowCopied(true); // Mostrar el mensaje "Copied"
        setTimeout(() => setShowCopied(false), 2000); // Ocultar después de 2 segundos
      }).catch(err => {
        console.error("Error al copiar el ID:", err);
      });
    }
  };

  return (
    <div className="w-1/4 bg-gradient-to-b from-[#1e293b] to-[#334155] text-white flex flex-col p-6 shadow-lg">
      {/* User Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Managé</h2>
        {user && (
          <div className="bg-[#475569] rounded-lg p-4 shadow">
            <p className="text-xl font-medium mb-1 text-center">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-300 mb-1 text-center">{user.email}</p>
            <div className="text-sm text-gray-300 mb-2 text-center flex items-center justify-center relative">
              <strong>Your ID:</strong> {user.id}
              <div className="relative ml-2">
                <button
                  onClick={handleCopyID}
                  className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-500"
                  title="Copy ID"
                >
                  🖹
                </button>
                {showCopied && (
                  <span className="absolute top-1/2 right-full translate-x-[110%] transform -translate-y-1/2 bg-blue-500 text-white text-xs rounded px-2 py-1 shadow">
                    Copied
                  </span>
                )}
              </div>
            </div>
            <p
              className={`text-sm font-semibold text-center ${
                user.isSubscribed ? "text-green-400" : "text-red-400"
              }`}
            >
              {user.isSubscribed ? "Active Subscription" : "No Subscription"}
            </p>
            {user.isSubscribed && subscriptionExpiration && (
              <p className="text-xs text-gray-400 text-center">
                Exp. Date: {new Date(subscriptionExpiration).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Subscribed User */}
      {user?.isSubscribed && (
        <div className="bg-[#475569] rounded-lg h-48">
          <TeamMembers />
        </div>
      )}

      {/* Not Subscribed User */}
      {!user?.isSubscribed && (
        <div className="bg-[#475569] rounded-lg h-48">
          <Members />
        </div>
      )}

      {/* API for Subscribed Users */}
      <div className="mt-auto border border-gray-500 rounded-xl text-center h-64 relative overflow-hidden bg-[#475569]">
        {user?.isSubscribed ? (
          <NasaApod />
        ) : (
          <>
            <div className="absolute inset-0">
              <div className="w-full h-full blur-sm opacity-50">
                <NasaApod />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-white font-semibold text-lg">
                Subscribe to unlock this feature!
              </p>
            </div>
          </>
        )}
      </div>

      {/* Subscription Management */}
      <div className="mt-auto">
        <a
          href="/pricing"
          className="block text-center text-white underline mb-4"
        >
          {user?.isSubscribed ? "Manage Subscription" : "Get Premium"}
        </a>
        <button
          onClick={logout}
          className="bg-red-500 rounded-lg py-2 px-4 w-full text-white hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
