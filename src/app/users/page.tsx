"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/app/store/userStore";
import { Input, NumberInput, Button } from "@/app/components/ui";

export default function UsersPage() {
  const { users, fetchUsers, createUser, deleteUser } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createUser({ name, email, age: age ? Number(age) : undefined });
    setName("");
    setEmail("");
    setAge("");
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <NumberInput placeholder="Age" value={age} onChange={setAge} className="w-16" />
        <Button type="submit">Add</Button>
      </form>

      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border rounded p-3 flex justify-between items-center">
            <Link href={`/users/${user._id}`} className="text-indigo-600 hover:underline">
              {user.name} — {user.email} {user.age ? `(${user.age})` : ""}
            </Link>
            <Button variant="danger" onClick={() => deleteUser(user._id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
