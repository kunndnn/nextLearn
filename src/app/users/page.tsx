"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    api.get<User[]>("/api/users").then(({ data }) => setUsers(data));
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await api.post<User>("/api/users", {
      name,
      email,
      age: age ? Number(age) : undefined,
    });
    setUsers((prev) => [...prev, data]);
    setName("");
    setEmail("");
    setAge("");
  }

  async function deleteUser(id: string) {
    await api.delete(`/api/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <form onSubmit={createUser} className="flex gap-2 mb-6">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-1"
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-1"
          required
        />
        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border rounded p-1 w-16"
        />
        <button type="submit" className="bg-blue-500 text-white rounded px-3">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border rounded p-3 flex justify-between items-center">
            <Link href={`/users/${user._id}`} className="text-indigo-600 hover:underline">
              {user.name} — {user.email} {user.age ? `(${user.age})` : ""}
            </Link>
            <button
              onClick={() => deleteUser(user._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
