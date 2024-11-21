import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskList from "../../components/dashboard/TaskList";

interface Member {
  id: number;
  email: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  members: Member[];
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Simulando datos de proyectos
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Project Alpha",
      description: "Alpha description",
      members: [{ id: 1, email: "john.doe@example.com" }],
    },
    {
      id: 2,
      name: "Project Beta",
      description: "Beta description",
      members: [],
    },
  ]);

  const project = projects.find((p) => p.id === parseInt(id || "0"));

  const [newMemberEmail, setNewMemberEmail] = useState("");

  const addMember = () => {
    if (project && newMemberEmail) {
      const updatedProjects = projects.map((p) => {
        if (p.id === project.id) {
          return {
            ...p,
            members: [
              ...p.members,
              { id: p.members.length + 1, email: newMemberEmail },
            ],
          };
        }
        return p;
      });
      setProjects(updatedProjects);
      setNewMemberEmail("");
    }
  };

  const deleteMember = (memberId: number) => {
    if (project) {
      const updatedProjects = projects.map((p) => {
        if (p.id === project.id) {
          return {
            ...p,
            members: p.members.filter((member) => member.id !== memberId),
          };
        }
        return p;
      });
      setProjects(updatedProjects);
    }
  };

  if (!project) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <button
          className="mt-4 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-700 mb-6">{project.description}</p>

      {/* Task Management */}
      <TaskList />

      {/* Member Management */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Project Members</h2>
        <ul className="space-y-2 mb-4">
          {project.members.map((member) => (
            <li
              key={member.id}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-2 shadow-sm"
            >
              <span>{member.email}</span>
              <button
                className="bg-red-500 text-white text-sm rounded px-3 py-1 hover:bg-red-600 transition"
                onClick={() => deleteMember(member.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {/* Add Member Form */}
        <div className="flex space-x-2">
          <input
            type="email"
            placeholder="Member Email"
            className="border border-gray-300 rounded p-2 flex-1"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
            onClick={addMember}
          >
            Add Member
          </button>
        </div>
      </div>

      {/* Back to Dashboard */}
      <button
        className="mt-8 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ProjectDetails;
