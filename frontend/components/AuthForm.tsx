"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const backend = "https://zocket-backend-y4xz.onrender.com";

  const handleAuth = async () => {
    const endpoint = mode === "login" ? "login" : "register";
    const body =
      mode === "login" ? { email, password } : { name, email, password };
    const res = await fetch(`${backend}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      if (payload?.user_id) {
        localStorage.setItem("user_id", payload.user_id);
      }
      window.location.href = "/tasks";
    }
  };
  const formattedTitle = mode.charAt(0).toUpperCase() + mode.slice(1);
  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader className="p-0">
        <CardTitle className="text-center text-xl">{formattedTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-5 flex flex-col">
        {mode === "register" && (
          <Input
            placeholder="Name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        )}
        <Input
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Button onClick={handleAuth}>
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </CardContent>
    </Card>
  );
}
