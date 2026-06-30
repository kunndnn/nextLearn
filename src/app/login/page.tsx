"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";
import { Input, Button } from "@/app/components/ui";
import { LoginSchema, getFieldErrors, type FieldErrors } from "@/app/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const parsed = LoginSchema.safeParse({ email, password });
    const errors = getFieldErrors(parsed);
    if (errors) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      router.push("/profile");
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setFieldErrors(serverErrors);
      } else {
        toast.error(err.response?.data?.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors({}); }} />
          {fieldErrors.email?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
        </div>
        <div>
          <Input placeholder="Password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors({}); }} />
          {fieldErrors.password?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
      </form>
      <div className="mt-4 text-sm flex flex-col gap-1">
        <Link href="/signup" className="text-indigo-600 hover:underline">Don't have an account? Sign up</Link>
        <Link href="/forgot-password" className="text-indigo-600 hover:underline">Forgot password?</Link>
      </div>
    </div>
  );
}
