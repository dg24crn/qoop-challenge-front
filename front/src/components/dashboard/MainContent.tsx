import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Task {
  id: number;
  name: string;
  completed: boolean;
  assignedTo?: string; // Miembro asignado
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

const MainContent: React.FC = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Project Alpha",
      tasks: [
        { id: 1, name: "Task 1", completed: false },
        { id: 2, name: "Task 2", completed: false },
      ],
    },
    {
      id: 2,
      name: "Project Beta",
      tasks: [
        { id: 1, name: "Task A", completed: false },
        { id: 2, name: "Task B", completed: false },
      ],
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const calculateProgress = (tasks: Task[]) => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100) || 0;
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleAssignMember = (taskId: number) => {
    if (!selectedProject) return;

    const memberName = prompt("Enter the member's name:");
    if (memberName) {
      const updatedTasks = selectedProject.tasks.map((task) =>
        task.id === taskId ? { ...task, assignedTo: memberName } : task
      );

      const updatedProjects = projects.map((project) =>
        project.id === selectedProject.id
          ? { ...project, tasks: updatedTasks }
          : project
      );

      setProjects(updatedProjects);
      setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    }
  };

  const handleCompleteTask = (taskId: number) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: true } : task
    );

    const updatedProjects = projects.map((project) =>
      project.id === selectedProject.id
        ? { ...project, tasks: updatedTasks }
        : project
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...selectedProject, tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: number) => {
    if (!selectedProject) return;

    const updatedTasks = selectedProject.tasks.filter((task) => task.id !== taskId);
    const updatedProjects = projects.map((project) =>
      project.id === selectedProject.id
        ? { ...project, tasks: updatedTasks }
        : project
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...selectedProject, tasks: updatedTasks });
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      {!selectedProject ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Projects</h1>
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-4 mb-4 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
              onClick={() => handleSelectProject(project)}
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <div className="mt-2">
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${calculateProgress(project.tasks)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateProgress(project.tasks)}% Completed
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{selectedProject.name}</h3>

          {/* Barra de Progreso */}
          <div className="mt-2 mb-4">
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${calculateProgress(selectedProject.tasks)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {calculateProgress(selectedProject.tasks)}% Completed
            </p>
          </div>

          {/* Tareas Pendientes */}
          <h4 className="text-md font-semibold mt-6 mb-2">Pending Tasks</h4>
          <ul className="space-y-2">
            {selectedProject.tasks
              .filter((task) => !task.completed)
              .map((task) => (
                <li
                  key={task.id}
                  className="p-2 rounded-lg flex justify-between items-center bg-red-100 text-red-800"
                >
                  <div>
                    <span>{task.name}</span>
                    {task.assignedTo && (
                      <p className="text-sm text-gray-600">
                        Assigned to: {task.assignedTo}
                      </p>
                    )}
                  </div>
                  {user?.isSubscribed && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAssignMember(task.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        Assign Member
                      </button>
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-green-600 transition"
                      >
                        Complete
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>

          {/* Tareas Completadas */}
          <h4 className="text-md font-semibold mt-6 mb-2">Completed Tasks</h4>
          <ul className="space-y-2">
            {selectedProject.tasks
              .filter((task) => task.completed)
              .map((task) => (
                <li
                  key={task.id}
                  className="p-2 rounded-lg flex justify-between items-center bg-gray-100 text-gray-500"
                >
                  <div>
                    <span className="line-through">{task.name}</span>
                    {task.assignedTo && (
                      <p className="text-sm text-gray-400">
                        Assigned to: {task.assignedTo}
                      </p>
                    )}
                  </div>
                  {user?.isSubscribed && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
          </ul>

          {/* Botón para Regresar */}
          <button
            className="mt-4 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
            onClick={() => setSelectedProject(null)}
          >
            Back to Projects
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
