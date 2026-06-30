"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";
import { Input, Button } from "@/app/components/ui";
import { ResetPasswordSchema, getFieldErrors, type FieldErrors } from "@/app/lib/validations";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const { resetPassword } = useAuthStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    if (!email || !otp) {
      toast.error("Invalid reset link");
      return;
    }

    const parsed = ResetPasswordSchema.safeParse({ email, otp, password });
    const errors = getFieldErrors(parsed);
    if (errors) {
      setFieldErrors(errors);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, password);
      router.push("/login?reset=success");
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setFieldErrors(serverErrors);
      } else {
        toast.error(err.response?.data?.error || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!email || !otp) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 border rounded text-center">
        <p className="text-red-500">Invalid reset link</p>
        <Link href="/forgot-password" className="text-indigo-600 hover:underline text-sm">Try again</Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="text-sm text-gray-600 mb-4">Enter your new password</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Input placeholder="New Password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors({}); }} />
          {fieldErrors.password?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
        </div>
        <div>
          <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors({}); }} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
      </form>
      <p className="mt-4 text-sm">
        <Link href="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto mt-10 p-6 border rounded text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
