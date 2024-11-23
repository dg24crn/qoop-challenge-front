import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";

interface NewProjectProps {
  onProjectCreated: () => void;
}

const NewProject: React.FC<NewProjectProps> = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const { user, token } = useAuth();
  
  const newProjectAlert = () => {
    Swal.fire(`Project ${projectName} has been created!`)
  }

  const handleCreateProject = async () => {
    if (!user || !token) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/projects/`,
        { name: projectName, owner_id: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Project created:", response.data);
      newProjectAlert()
      setProjectName("");
      onProjectCreated();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Create New Project</h3>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name"
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
      />
      <button
        onClick={handleCreateProject}
        disabled={!projectName.trim()}
        className={`w-full py-2 text-white rounded-lg ${
          projectName.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Create Project
      </button>
    </div>
  );
};

export default NewProject;
