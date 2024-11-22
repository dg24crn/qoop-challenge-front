/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Team {
  id: number;
  name: string;
}

const TeamMembers: React.FC = () => {
  const { user, token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [team, setTeam] = useState<Team | null>(null); // Estado para el equipo
  const [teamName, setTeamName] = useState<string>(""); // Input para crear un equipo
  const [userIdToAdd, setUserIdToAdd] = useState<string>(""); // Input para agregar miembros
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingRemove, setLoadingRemove] = useState<number | null>(null); // ID del miembro en proceso de eliminación

  // Obtener el equipo del usuario
  const fetchTeam = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/teams/by_owner/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeam(response.data); // Guardar el equipo
    } catch (error) {
      console.error("No team found for user:", error);
      setTeam(null); // Si no se encuentra, no hay equipo
    } finally {
      setLoading(false);
    }
  };

  // Obtener miembros del equipo
  const fetchTeamMembers = async () => {
    if (!team) return; // Solo intentar si hay un equipo

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/teams/${team.id}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Crear un equipo
  const createTeam = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/teams/`,
        {
          name: teamName,
          owner_id: user?.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeam(response.data); // Guardar el equipo creado
      setTeamName("");
      setSuccessMessage("Team created successfully!");
    } catch (error: any) {
      console.error("Error creating team:", error);
      setError("Failed to create the team.");
    }
  };

  // Agregar un miembro al equipo
  const addMember = async () => {
    if (!team) return; // Solo intentar si hay un equipo

    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/teams/${team.id}/add_member`,
        { user_id: Number(userIdToAdd) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserIdToAdd("");
      fetchTeamMembers(); // Actualizar miembros
      setSuccessMessage(response.data.message); // Mostrar el mensaje de éxito del backend
    } catch (error: any) {
      console.error("Error adding member:", error);
      // Manejar el error si el usuario ya es miembro
      if (error.response?.status === 400 && error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to add member. Make sure the user ID is valid.");
      }
    }
  };

  // Eliminar un miembro del equipo
  const removeMember = async (memberId: number) => {
    if (!team) {
      setError("No team found."); // Validar que exista un equipo
      return;
    }

    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/teams/${team.id}/remove_member/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTeamMembers(); // Actualizar miembros después de eliminar
      setSuccessMessage(response.data.message); // Mostrar el mensaje de éxito devuelto por el backend
    } catch (error: any) {
      console.error("Error removing member:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Failed to remove member.");
      }
    }
  };

  useEffect(() => {
    fetchTeam(); // Verificar si el equipo existe al cargar el componente
  }, [user, token]);

  useEffect(() => {
    if (team) {
      fetchTeamMembers(); // Cargar miembros si hay equipo
    }
  }, [team]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {team ? (
        <>
          <h3 className="text-xl font-bold mb-4 text-center">{team.name}</h3>
          <h3 className="text-m font-bold mb-4">Team Members</h3>
          <div className="mb-4">
            <h4 className="text-md font-semibold mb-2">Add Member by ID</h4>
            <div className="flex gap-2">
              <input
                type="number" // Aseguramos que solo acepte números
                value={userIdToAdd}
                onChange={(e) => setUserIdToAdd(e.target.value)}
                placeholder="Enter user ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                min="0" // Evitar números negativos
              />
              <button
                onClick={addMember}
                disabled={!userIdToAdd.trim()}
                className={`px-4 py-2 text-white rounded-lg ${
                  userIdToAdd.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Add
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {successMessage && (
              <p className="text-green-500 text-sm mt-2">{successMessage}</p>
            )}
          </div>
          {members.length > 0 ? (
            <ul>
              {members.map((member) => (
                <li
                  key={member.id}
                  className="border-b border-gray-200 py-2 flex justify-between"
                >
                  <span>
                    {member.first_name} {member.last_name}
                  </span>
                  <span className="mx-4">{member.email}</span>
                  <button
                    onClick={() => removeMember(member.user_id)} // Asegúrate de usar el user_id
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                  >
                    REMOVE
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members found.</p>
          )}
        </>
      ) : (
        <div>
          <h3 className="text-lg font-bold mb-4">Create Team</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={createTeam}
              disabled={!teamName.trim()}
              className={`px-4 py-2 text-white rounded-lg ${
                teamName.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Create Team
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
