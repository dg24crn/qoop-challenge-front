import React, { useState } from "react";

const MembersList: React.FC = () => {
  // Simulando datos de miembros
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  ]);

  const [email, setEmail] = useState("");

  const handleAddMember = () => {
    if (email) {
      setMembers([
        ...members,
        {
          id: members.length + 1,
          name: "New Member", // Nombre genérico para miembros agregados sin nombre
          email: email,
        },
      ]);
      setEmail(""); // Limpiar el campo después de agregar
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Members</h3>
      {members.length === 0 ? (
        <p className="text-gray-500">No members available.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-col bg-gray-100 rounded-lg p-2 shadow-sm"
            >
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-gray-500">{member.email}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Add Member Form */}
      <div className="flex flex-col space-y-2">
        <input
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
          onClick={handleAddMember}
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default MembersList;
