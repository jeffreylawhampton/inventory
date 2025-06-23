"use client";
import { useState, useTransition } from "react";
import { updateAuth0User } from "../actions";
import { TextInput, Button } from "@mantine/core";

export default function UpdateProfileForm({ user, setJustUpdated }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await updateAuth0User({
          auth0Id: user.sub,
          name,
          email,
          password,
        });
        setJustUpdated(true);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[400px]">
      <TextInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
      />
      <TextInput
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" disabled={isPending}>
        Update
      </Button>
    </form>
  );
}
