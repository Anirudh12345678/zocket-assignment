"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function SuggestPage() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [save, setSave] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const backend = "https://zocket-backend-y4xz.onrender.com";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("user_id");
    if (!storedToken || !storedUserId) window.location.href = "/login";
    else {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

  const handleSuggest = async () => {
    setLoading(true);
    setSuggestions([]);
    const res = await fetch(`${backend}/api/tasks/suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, user_id: userId }),
    });
    const data = await res.json();
    const tasks = data.suggested_tasks || [];
    setSuggestions(tasks);

    if (save) {
      for (const title of tasks) {
        await fetch(`${backend}/api/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Title: title,
            Status: "pending",
            UserID: userId,
            DueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          }),
        });
      }
      window.location.href = "/tasks";
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl text-indigo-400 mx-auto py-10 space-y-4 bg-gray-900">
      <Textarea
        placeholder="Ask AI: Suggest 5 tasks for improving productivity"
        value={prompt}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setPrompt(e.target.value)
        }
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={save}
          onCheckedChange={(v: boolean | "indeterminate") => setSave(!!v)}
        />
        <label className="text-indigo-300">
          Save suggestions to my task list
        </label>
      </div>
      <Button onClick={handleSuggest} disabled={loading}>
        {loading ? "Getting Suggestions..." : "Get AI Suggestions"}
      </Button>

      {suggestions.length > 0 && (
        <ul className="list-disc pl-5 mt-4 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
