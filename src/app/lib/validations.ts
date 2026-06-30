import { z } from "zod/v3";

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").trim(),
});

export const VerifyOTPSchema = z.object({
  email: z.string().email("Invalid email").trim(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email").trim(),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim().optional(),
  phone: z.string().optional(),
  age: z.number().min(1).max(150).optional(),
});

export type FieldErrors = Record<string, string[]>;

export function getFieldErrors(result: z.SafeParseReturnType<unknown, unknown>): FieldErrors | null {
  if (!result.success) {
    return (result as z.SafeParseError<unknown>).error.flatten().fieldErrors as FieldErrors;
  }
  return null;
}

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
