import React, { useState } from "react";

const ManageProjects: React.FC = () => {
  // Simulando datos de proyectos
  const [projects, setProjects] = useState([
    { id: 1, name: "Project Alpha" },
    { id: 2, name: "Project Beta" },
    { id: 3, name: "Project Gamma" },
  ]);

  const [projectName, setProjectName] = useState("");

  const handleAddProject = () => {
    if (projectName) {
      setProjects([
        ...projects,
        { id: projects.length + 1, name: projectName },
      ]);
      setProjectName("");
    }
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Manage Projects</h3>

      {/* Add New Project Form */}
      <div className="flex flex-col space-y-2 mb-4">
        <input
          type="text"
          placeholder="Project Name"
          className="border border-gray-300 rounded p-2"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
          onClick={handleAddProject}
        >
          Create New Project
        </button>
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-2 shadow-sm"
            >
              <span>{project.name}</span>
              <button
                className="bg-red-500 text-white text-sm rounded px-3 py-1 hover:bg-red-600 transition"
                onClick={() => handleDeleteProject(project.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageProjects;
