import React from "react";
import { useAuth } from "../../../context/AuthContext";

const Sidebar: React.FC = () => {
  const { user, toggleSubscription } = useAuth();

  const handleCreateProject = () => {
    alert("Create New Project functionality goes here!");
  };

  const handleManageProjects = () => {
    alert("Manage Projects functionality goes here!");
  };

  const handleManageMembers = () => {
    alert("Members management functionality goes here!");
  };

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
            <p className="text-sm text-gray-600 mb-2 text-center">{user.email}</p>
            <p
              className={`text-sm font-semibold text-center ${
                user.isSubscribed ? "text-green-500" : "text-red-500"
              }`}
            >
              {user.isSubscribed ? "Active Subscription" : "No Subscription"}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <button
          className={`rounded-lg py-2 px-4 text-white transition ${
            user?.isSubscribed
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleCreateProject}
          disabled={!user?.isSubscribed}
        >
          Create New Project
        </button>
        <button
          className={`rounded-lg py-2 px-4 text-white transition ${
            user?.isSubscribed
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleManageProjects}
          disabled={!user?.isSubscribed}
        >
          Manage Projects
        </button>
        <button
          className={`rounded-lg py-2 px-4 text-white transition ${
            user?.isSubscribed
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleManageMembers}
          disabled={!user?.isSubscribed}
        >
          Members
        </button>
      </div>

      {/* Manage Subscription */}
      <div className="mt-auto">
        <a
          href="/pricing"
          className="block text-center text-black underline mb-4"
        >
          Manage Subscription
        </a>
        <button
          onClick={toggleSubscription}
          className="bg-gray-500 rounded-lg py-2 px-4 mb-4 w-full text-white hover:bg-gray-600 transition"
        >
          Toggle Subscription
        </button>
        <button className="bg-red-500 rounded-lg py-2 px-4 w-full text-white hover:bg-red-600 transition">
          Log Out
        </button>
      </div>
    </div>
  );
  
};

export default Sidebar;
