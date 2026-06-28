"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/app/store/userStore";
import { Input, NumberInput, Button } from "@/app/components/ui";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentUser, fetchUser, updateUser, deleteUser } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    fetchUser(id);
  }, [id, fetchUser]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setAge(currentUser.age?.toString() || "");
    }
  }, [currentUser]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    await updateUser(id, { name, email, age: age ? Number(age) : undefined });
  }

  async function handleDelete() {
    await deleteUser(id);
    router.push("/users");
  }

  if (!currentUser) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <Link href="/users" className="text-indigo-600 hover:underline text-sm">
        &larr; Back
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-4">Edit User</h1>

      <form onSubmit={handleUpdate} className="space-y-3">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" required />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" required />
        <NumberInput placeholder="Age" value={age} onChange={setAge} className="w-full" />
        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
