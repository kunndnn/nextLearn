import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { hashPassword, comparePassword, generateOTP } from "@/app/lib/auth";
import { createSession } from "@/app/lib/session";

await connectDB();

export async function signup(data: { name: string; email: string; password: string }) {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return { id: user._id.toString(), name: user.name, email: user.email };
}

export async function login(data: { email: string; password: string }) {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await comparePassword(data.password, user.password);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  return { id: user._id.toString(), name: user.name, email: user.email };
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email");
  }

  const otp = generateOTP();
  user.resetOtp = otp;
  user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  return { otp, message: "OTP sent to your email" };
}

export async function verifyOTP(email: string, otp: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email");
  }

  if (!user.resetOtp || !user.resetOtpExpiry) {
    throw new Error("No OTP requested");
  }

  if (user.resetOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.resetOtpExpiry < new Date()) {
    throw new Error("OTP has expired");
  }

  return { message: "OTP verified successfully" };
}

export async function resendOTP(email: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email");
  }

  const otp = generateOTP();
  user.resetOtp = otp;
  user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  return { otp, message: "New OTP sent to your email" };
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email");
  }

  if (!user.resetOtp || !user.resetOtpExpiry) {
    throw new Error("No OTP requested");
  }

  if (user.resetOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.resetOtpExpiry < new Date()) {
    throw new Error("OTP has expired");
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  await user.save();

  return { message: "Password reset successfully" };
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password changed successfully" };
}

export async function getProfile(userId: string) {
  const user = await User.findById(userId).select("-password -resetOtp -resetOtpExpiry");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function updateProfile(userId: string, data: { name?: string; phone?: string; age?: number }) {
  const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true })
    .select("-password -resetOtp -resetOtpExpiry");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
