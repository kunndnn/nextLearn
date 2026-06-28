"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/app/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    api.get<User>(`/api/users/${id}`).then(({ data }) => {
      setUser(data);
      setName(data.name);
      setEmail(data.email);
      setAge(data.age?.toString() || "");
    });
  }, [id]);

  async function updateUser(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await api.put<User>(`/api/users/${id}`, {
      name,
      email,
      age: age ? Number(age) : undefined,
    });
    setUser(data);
  }

  async function deleteUser() {
    await api.delete(`/api/users/${id}`);
    router.push("/users");
  }

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <Link href="/users" className="text-indigo-600 hover:underline text-sm">
        &larr; Back
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-4">Edit User</h1>

      <form onSubmit={updateUser} className="space-y-3">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-1 w-full"
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-1 w-full"
          required
        />
        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border rounded p-1 w-full"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white rounded px-3 py-1">
            Save
          </button>
          <button
            type="button"
            onClick={deleteUser}
            className="bg-red-500 text-white rounded px-3 py-1"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
