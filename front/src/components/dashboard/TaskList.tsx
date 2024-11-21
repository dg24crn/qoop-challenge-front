import React, { useState } from "react";

interface Task {
  id: number;
  name: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "High" | "Medium" | "Low";
  dueDate: string; // Fecha en formato ISO (YYYY-MM-DD)
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Task 1", status: "To Do", priority: "High", dueDate: "2024-11-25" },
    { id: 2, name: "Task 2", status: "In Progress", priority: "Medium", dueDate: "2024-11-27" },
    { id: 3, name: "Task 3", status: "Done", priority: "Low", dueDate: "2024-11-22" },
  ]);

  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [dueDate, setDueDate] = useState("");

  const addTask = () => {
    if (taskName && dueDate) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          name: taskName,
          status: "To Do",
          priority,
          dueDate,
        },
      ]);
      setTaskName("");
      setPriority("Medium");
      setDueDate("");
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const changeStatus = (id: number, status: "To Do" | "In Progress" | "Done") => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: status } : task
      )
    );
  };

  // Calcula el progreso para cada estado
  const calculateProgress = (status: "To Do" | "In Progress" | "Done") => {
    const total = tasks.length;
    const count = tasks.filter((task) => task.status === status).length;
    return total === 0 ? 0 : Math.round((count / total) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Tasks</h3>

      {/* Add Task Form */}
      <div className="flex flex-col space-y-2 mb-6">
        <input
          type="text"
          placeholder="Task Name"
          className="border border-gray-300 rounded p-2"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded p-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <input
          type="date"
          className="border border-gray-300 rounded p-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      {/* Task Progress */}
      {["To Do", "In Progress", "Done"].map((status) => (
        <div key={status} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-bold">{status}</h4>
            <span className="text-sm text-gray-500">
              {calculateProgress(status)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-blue-600 h-2 rounded-full`}
              style={{ width: `${calculateProgress(status)}%` }}
            ></div>
          </div>
        </div>
      ))}

      {/* Task List */}
      {["To Do", "In Progress", "Done"].map((status) => (
        <div key={status} className="mb-6">
          <h4 className="text-md font-bold mb-2">{status}</h4>
          <ul className="space-y-2">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center bg-gray-100 rounded-lg p-2 shadow-sm hover:scale-[1.02] transform transition"
                >
                  <div>
                    <span className="font-medium">{task.name}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({task.priority} - Due: {task.dueDate})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      className="border border-gray-300 rounded p-1"
                      value={task.status}
                      onChange={(e) =>
                        changeStatus(task.id, e.target.value as "To Do" | "In Progress" | "Done")
                      }
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <button
                      className="bg-red-500 text-white text-sm rounded px-3 py-1 hover:bg-red-600 transition"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
