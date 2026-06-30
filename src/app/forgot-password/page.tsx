"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";
import { Input, Button } from "@/app/components/ui";
import { ForgotPasswordSchema, getFieldErrors, type FieldErrors } from "@/app/lib/validations";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const parsed = ForgotPasswordSchema.safeParse({ email });
    const errors = getFieldErrors(parsed);
    if (errors) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-sm text-gray-600 mb-4">Enter your email to receive an OTP</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors({}); }} />
          {fieldErrors.email?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
      </p>
    </div>
  );
}
