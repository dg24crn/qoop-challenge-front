import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import NewProject from "./sidebar/NewProject";
import Swal from "sweetalert2";
import ChatButton from "../chatbutton/Chatbutton";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface Project {
  id: number;
  name: string;
  owner_id: number;
  progress?: string;
  tasks?: Task[];
}

const MainContent: React.FC = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);

  const projectDeletedAlert = () => {
    Swal.fire(`Project deleted succesfully!`);
  };

  //* Obtener el equipo del usuario
  const fetchTeam = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/teams/by_user/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeamId(response.data.team.id);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  //* Obtener proyectos dependiendo del tipo de usuario
  const fetchProjects = async () => {
    try {
      let response;
      if (user?.isSubscribed) {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/projects/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (teamId) {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/projects/team/${teamId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      const projectsWithProgress = await Promise.all(
        response?.data.map(async (project: Project) => {
          const progressResponse = await fetchProjectProgress(project.id);
          return { ...project, progress: progressResponse.progress };
        })
      );

      setProjects(projectsWithProgress);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  //* Obtener Progreso de Proyecto
  const fetchProjectProgress = async (projectId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching project progress:", error);
      return { progress: "0%" };
    }
  };

  //* Obtener tareas de un proyecto
  const fetchProjectTasks = async (projectId: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/tasks?project_id=${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //* Actualizar tareas para el proyecto
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, tasks: response.data }
            : project
        )
      );

      //* Comprobar tareas
      if (selectedProject?.id === projectId) {
        setSelectedProject((prev) =>
          prev ? { ...prev, tasks: response.data } : null
        );
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  //* Fetch inicial
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  //* Cargar tareas
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
        `${import.meta.env.VITE_BACKEND_URL}/tasks/`,
        { name: newTaskName, project_id: selectedProject.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTaskName("");
      fetchProjectTasks(selectedProject.id);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error creating task. Please try again.");
    }
  };

  //* Completar tarea
  const handleCompleteTask = async (taskId: number) => {
    if (!selectedProject) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`,
        { completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //* Recargar las tareas del proyecto
      fetchProjectTasks(selectedProject.id);

      //* Actualizar el progreso del proyecto
      updateProjectProgress(selectedProject.id);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  //* Eliminar tarea
  const handleDeleteTask = async (taskId: number) => {
    if (!selectedProject) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //* Recargar las tareas del proyecto
      fetchProjectTasks(selectedProject.id);

      //* Actualizar el progreso del proyecto
      updateProjectProgress(selectedProject.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  //* Actualizar el progreso del proyecto en el estado local
  const updateProjectProgress = async (projectId: number) => {
    try {
      const response = await fetchProjectProgress(projectId);

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, progress: response.progress }
            : project
        )
      );

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
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(projects.filter((project) => project.id !== projectId));
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
      projectDeletedAlert();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleProjectCreated = () => {
    fetchProjects();
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  useEffect(() => {
    if (token && !user?.isSubscribed) {
      fetchTeam();
    }
  }, [token, user?.isSubscribed]);

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token, teamId]);

  return (
    <div className="flex-1 bg-gray-50 p-8">
      {!selectedProject ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Projects</h1>
          <hr />
          <br />
          <div className="mb-8">
            <div className="relative">
              {user?.isSubscribed ? (
                <NewProject onProjectCreated={handleProjectCreated} />
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-10">
                    <span className="text-gray-700 text-center font-bold">
                      ONLY TEAM OWNER CAN CREATE PROJECTS
                    </span>
                  </div>
                  <NewProject onProjectCreated={handleProjectCreated} />
                </div>
              )}
            </div>
          </div>
          {/* Contenedor con scroll */}
          <div className="max-h-[calc(85vh-200px)] overflow-y-auto">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white p-4 mb-4 rounded-lg shadow hover:bg-gray-100 transition relative"
                >
                  <h2 className="text-lg font-semibold">{project.name}</h2>

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
              ))
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-700">
                No projects available.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Vista detallada del proyecto */}
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
      <ChatButton />
    </div>
  );
};

export default MainContent;
