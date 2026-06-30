"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";
import { Input, Button } from "@/app/components/ui";
import { VerifyOTPSchema, getFieldErrors, type FieldErrors } from "@/app/lib/validations";

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { verifyOTP, resendOTP } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    if (!email) {
      toast.error("No email provided");
      return;
    }

    const parsed = VerifyOTPSchema.safeParse({ email, otp });
    const errors = getFieldErrors(parsed);
    if (errors) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otp);
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setFieldErrors(serverErrors);
      } else {
        toast.error(err.response?.data?.error || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setResent(false);
    try {
      await resendOTP(email);
      setResent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to resend OTP");
    }
  }

  if (!email) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 border rounded text-center">
        <p className="text-red-500">No email provided</p>
        <Link href="/forgot-password" className="text-indigo-600 hover:underline text-sm">Go back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
      <p className="text-sm text-gray-600 mb-4">OTP sent to {email}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setFieldErrors({}); }}
            maxLength={6}
          />
          {fieldErrors.otp?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
        </div>
        {resent && <p className="text-green-500 text-sm">New OTP sent!</p>}
        <Button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
      </form>
      <div className="mt-4 text-sm flex flex-col gap-1">
        <button onClick={handleResend} className="text-indigo-600 hover:underline text-left">
          Resend OTP
        </button>
        <Link href="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto mt-10 p-6 border rounded text-center">Loading...</div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}
