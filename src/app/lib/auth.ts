import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}
