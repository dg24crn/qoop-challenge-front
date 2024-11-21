import React from "react";
import Sidebar from "../../components/dashboard/sidebar/Sidebar";
import MainContent from "../../components/dashboard/MainContent";

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

export default Dashboard;
