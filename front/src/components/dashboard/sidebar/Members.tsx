import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../loading/Loading";

interface Team {
  id: number;
  name: string;
  created_at: string;
}

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Owner {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const Members: React.FC = () => {
  const { user, token } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  //* Función para obtener los datos del equipo del usuario
  const fetchTeamData = async () => {
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
      console.error("Error fetching team data:", error);
      if (error.response && error.response.status === 404) {
        setError("You are not part of any team.");
      } else {
        setError("An error occurred while fetching the team data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeamData();
    }
  }, [user, token]);

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  return (
    <div className="h-48 overflow-y-auto bg-[#475569] rounded-lg p-4 shadow">
      {team ? (
        <>
          <h3 className="text-xl text-center font-bold mb-2">{team.name}</h3>
          <hr />
          <div className="mb-4">
            <h4 className="text-md font-semibold">Team Owner</h4>
            <p>
              {owner?.first_name} {owner?.last_name} - {owner?.email}
            </p>
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
                  <span>{member.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members found.</p>
          )}
        </>
      ) : (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Members;
