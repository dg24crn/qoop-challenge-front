import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import NasaApod from "../../apis/NasaApod";
import TeamMembers from "./TeamMembers"; // Importar el nuevo componente
import Members from "./Members";

const Sidebar: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [subscriptionExpiration, setSubscriptionExpiration] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user || !token) return;

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/users/${user.id}/subscription-status`,
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

  return (
    <div className="w-1/4 bg-gradient-to-b from-[#f7f3e9] to-[#e8dfce] text-gray-800 flex flex-col p-6 shadow-lg">
      {/* User Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Managé</h2>
        {user && (
          <div className="bg-[#e4dbc5] rounded-lg p-4 shadow">
            <p className="text-xl font-medium mb-1 text-center">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-600 mb-1 text-center">{user.email}</p>
            <p className="text-sm text-gray-600 mb-2 text-center">
              <strong>Your ID:</strong> {user.id}
            </p>
            <p
              className={`text-sm font-semibold text-center ${
                user.isSubscribed ? "text-green-500" : "text-red-500"
              }`}
            >
              {user.isSubscribed ? "Active Subscription" : "No Subscription"}
            </p>
            {user.isSubscribed && subscriptionExpiration && (
              <p className="text-xs text-gray-700 text-center">
                Exp. Date:{" "}
                {new Date(subscriptionExpiration).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/*  Subscribed User */}
      <div className="flex flex-col gap-4">
        {user?.isSubscribed && <TeamMembers />} {/* Renderizar TeamMembers aquí */}
      </div>

      {/* Not Subscribed User */}
      <div className="flex flex-col gap-4">
        {!user?.isSubscribed && <Members />}
      </div>

      {/* API for Subscribed Users */}
      <div className="mt-auto border border-red-200 rounded-xl text-center h-64 relative overflow-hidden">
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
          className="block text-center text-black underline mb-4"
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
