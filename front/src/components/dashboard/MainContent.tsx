import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import NewProject from "./sidebar/NewProject";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface Project {
  id: number;
  name: string;
  owner_id: number;
  progress?: string; // Progreso del proyecto como porcentaje
  tasks?: Task[];
}

const MainContent: React.FC = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newTaskName, setNewTaskName] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/projects/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projectsWithProgress = await Promise.all(
        response.data.map(async (project: Project) => {
          const progressResponse = await fetchProjectProgress(project.id);
          return { ...project, progress: progressResponse.progress };
        })
      );

      setProjects(projectsWithProgress);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch progress for a project
  const fetchProjectProgress = async (projectId: number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/projects/${projectId}/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching project progress:", error);
      return { progress: "0%" }; // Retorna progreso cero si hay error
    }
  };

  // Fetch tasks for a specific project
  const fetchProjectTasks = async (projectId: number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/tasks?project_id=${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update tasks for the specific project
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, tasks: response.data }
            : project
        )
      );

      // Ensure selectedProject's tasks are updated if it matches
      if (selectedProject?.id === projectId) {
        setSelectedProject((prev) =>
          prev ? { ...prev, tasks: response.data } : null
        );
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Initial fetch for projects
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  // Load tasks when a project is selected
  useEffect(() => {
    if (selectedProject?.id) {
      fetchProjectTasks(selectedProject.id);
    }
  }, [selectedProject?.id]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCreateTask = async () => {
    if (!newTaskName.trim() || !selectedProject) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/tasks/",
        { name: newTaskName, project_id: selectedProject.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTaskName("");
      fetchProjectTasks(selectedProject.id); // Reload tasks after creating a new one
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error creating task. Please try again.");
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    if (!selectedProject) return;

    try {
      // Marcar la tarea como completada
      await axios.put(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        { completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Recargar las tareas del proyecto
      fetchProjectTasks(selectedProject.id);

      // Actualizar el progreso del proyecto
      updateProjectProgress(selectedProject.id);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!selectedProject) return;

    try {
      // Eliminar la tarea
      await axios.delete(`http://127.0.0.1:8000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Recargar las tareas del proyecto
      fetchProjectTasks(selectedProject.id);

      // Actualizar el progreso del proyecto
      updateProjectProgress(selectedProject.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateProjectProgress = async (projectId: number) => {
    try {
      const response = await fetchProjectProgress(projectId);

      // Actualizar el progreso del proyecto en el estado local
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, progress: response.progress }
            : project
        )
      );

      // Si el proyecto seleccionado coincide, actualiza también su progreso
      if (selectedProject?.id === projectId) {
        setSelectedProject((prev) =>
          prev ? { ...prev, progress: response.progress } : null
        );
      }
    } catch (error) {
      console.error("Error updating project progress:", error);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((project) => project.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleProjectCreated = () => {
    fetchProjects(); // Reload projects after creating a new one
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      {!selectedProject ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Projects</h1>
          <div className="mb-8">
            {user?.isSubscribed ? (
              <NewProject onProjectCreated={handleProjectCreated} />
            ) : null}
          </div>
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-4 mb-4 rounded-lg shadow hover:bg-gray-100 transition relative"
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Owner: {user?.email}</p>

              {/* Barra de Progreso */}
              <div className="mt-2">
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: project.progress }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Progress: {project.progress}
                </p>
              </div>

              <button
                onClick={() => handleSelectProject(project)}
                className="mt-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
              >
                View Project
              </button>
              {user?.isSubscribed ? (
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-4">{selectedProject.name}</h3>

          {/* Barra de Progreso en Vista Detallada */}
          <div className="mt-2 mb-4">
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: selectedProject.progress }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Progress: {selectedProject.progress}
            </p>
          </div>

          {user?.isSubscribed ? (
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2">Create New Task</h4>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter task name"
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                onClick={handleCreateTask}
                disabled={!newTaskName.trim()}
                className={`w-full py-2 text-white rounded-lg ${
                  newTaskName.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Create Task
              </button>
            </div>
          ) : null}

          {/* Tareas Pendientes */}
          <h4 className="text-md font-semibold mt-6 mb-2">Pending Tasks</h4>
          <ul className="space-y-2">
            {selectedProject.tasks
              ?.filter((task) => !task.completed)
              .map((task) => (
                <li
                  key={task.id}
                  className="p-2 rounded-lg flex justify-between items-center bg-gray-100 text-gray-800"
                >
                  <span>{task.name}</span>
                  {user?.isSubscribed ? (
                    <>
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded-lg ml-auto mr-2 text-sm hover:bg-green-600 transition"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                </li>
              ))}
          </ul>

          {/* Tareas Completadas */}
          <h4 className="text-md font-semibold mt-6 mb-2">Completed Tasks</h4>
          <ul className="space-y-2">
            {selectedProject.tasks
              ?.filter((task) => task.completed)
              .map((task) => (
                <li
                  key={task.id}
                  className="p-2 rounded-lg flex justify-between items-center bg-gray-300 text-gray-600"
                >
                  <span className="line-through">{task.name}</span>
                  {user?.isSubscribed ? (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  ) : null}
                </li>
              ))}
          </ul>

          <button
            className="mt-4 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
            onClick={handleBackToProjects}
          >
            Back to Projects
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
