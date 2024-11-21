import React from "react";

interface Project {
  id: number;
  name: string;
}

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Your Projects</h3>
      {projects.length === 0 ? (
        <p className="text-gray-500">
          No projects available. Start by creating a new project!
        </p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-2 shadow-sm hover:bg-gray-200 cursor-pointer"
              onClick={() => onSelectProject(project)}
            >
              <span>{project.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
