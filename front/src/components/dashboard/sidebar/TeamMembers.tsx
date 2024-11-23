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
  created_at: string;
}

interface Owner {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const TeamMembers: React.FC = () => {
  const { user, token } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamName, setTeamName] = useState<string>(""); // Para crear un equipo
  const [userIdToAdd, setUserIdToAdd] = useState<string>(""); // Input para agregar miembros

  // Obtener el equipo al que pertenece el usuario
  const fetchUserTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/teams/by_user/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeam(response.data.team);
      setOwner(response.data.owner);
      setMembers(response.data.members);
    } catch (error: any) {
      console.error("Error fetching user team:", error);
      setTeam(null); // Aseguramos que `team` esté en null si no hay equipo
    } finally {
      setLoading(false);
    }
  };

  // Crear un equipo
  const createTeam = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/teams/`,
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
      fetchUserTeam(); // Actualizar equipo después de crearlo
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
        `${import.meta.env.VITE_BACKEND_URL}/teams/${team.id}/add_member`,
        { user_id: Number(userIdToAdd) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserIdToAdd("");
      fetchUserTeam(); // Actualizar miembros
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
        `${import.meta.env.VITE_BACKEND_URL}/teams/${team.id}/remove_member/${memberId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUserTeam(); // Actualizar miembros después de eliminar
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
    fetchUserTeam();
  }, [user, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {team ? (
        <>
          <h3 className="text-xl font-bold mb-4 text-center">{team.name}</h3>
          <p className="text-sm text-gray-600 mb-4">
            Created At: {new Date(team.created_at).toLocaleDateString()}
          </p>
          <div className="mb-4">
            <h4 className="text-md font-semibold">Team Owner</h4>
            <p>
              {owner?.first_name} {owner?.last_name} - {owner?.email}
            </p>
          </div>
          <div className="mb-4">
            <h4 className="text-md font-semibold mb-2">Add Member by ID</h4>
            <div className="flex gap-2">
              <input
                type="number"
                value={userIdToAdd}
                onChange={(e) => setUserIdToAdd(e.target.value)}
                placeholder="Enter user ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                min="0"
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
          <h4 className="text-md font-semibold mb-2">Team Members</h4>
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
                  {/*                   <button
                    onClick={() => removeMember(member.id)} // Cambié member.user_id a member.id
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                  >
                    REMOVE
                  </button> */}
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
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
