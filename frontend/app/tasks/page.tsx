"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { redirect } from "next/navigation";

type Task = {
  ID: string;
  UserId: string;
  Title: string;
  DueDate: Date;
  Status: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const backend = "https://zocket-backend-y4xz.onrender.com/api/tasks";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("user_id");
    if (!storedToken || !storedUserId) window.location.href = "/login";
    else {
      setToken(storedToken);
      setUserId(storedUserId);
      fetchTasks(storedToken);
    }

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://zocket-backend-y4xz.onrender.com/ws/${userId}`);
    socket.onmessage = (event) => {
      const updatedTasks = JSON.parse(event.data);
      setTasks(updatedTasks);
    };
    return () => socket.close();
  }, []);

  const fetchTasks = async (token: string) => {
    const res = await fetch(
      `https://zocket-backend-y4xz.onrender.com/api/tasks`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  };

  const handleAddTask = async () => {
    if (!newTask) return;
    const due = dueDate ? new Date(dueDate).toISOString() : null;
    await fetch(`${backend}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Title: newTask,
        Status: "pending",
        UserID: userId,
        DueDate: due,
      }),
    });
    setNewTask("");
    setDueDate("");
    fetchTasks(token);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${backend}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks(token);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    await fetch(`${backend}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks(token);
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.ID);
    setEditedTitle(task.Title);
    setEditedDueDate(
      task.DueDate ? new Date(task.DueDate).toISOString().split("T")[0] : "",
    );
  };

  const handleUpdate = async (id: string) => {
    await fetch(`${backend}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Title: editedTitle,
        DueDate: editedDueDate ? new Date(editedDueDate).toISOString() : null,
      }),
    });
    setEditingTaskId(null);
    fetchTasks(token);
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6 bg-gray-900">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => redirect("/suggest")}>
          Get AI Suggestions
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-2 text-indigo-400 space-y-2 sm:space-y-0">
        <Input
          placeholder="New Task"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewTask(e.target.value)
          }
        />
        <Input
          type="date"
          value={dueDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDueDate(e.target.value)
          }
        />
        <Button onClick={handleAddTask}>Add</Button>
      </div>

      {tasks.map((task: Task, i) => (
        <Card key={i} className="relative">
          <CardContent className="p-4 space-y-1">
            {editingTaskId === task.ID ? (
              <div className="space-y-2">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <Input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => handleUpdate(task.ID)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTaskId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="text-lg font-medium cursor-pointer"
                  onClick={() => handleToggleStatus(task.ID, task.Status)}
                >
                  {task.Title}
                </div>
                <div className="text-sm text-gray-500">
                  Status: {task.Status}
                </div>
                {task.DueDate && (
                  <div className="text-sm text-gray-500">
                    Due: {format(new Date(task.DueDate), "PPP")}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(task.ID)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
