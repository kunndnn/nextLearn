import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

await connectDB();

export async function getAllUsers() {
  return await User.find();
}

export async function getUserById(id: string) {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return user;
}

export async function createUser(data: { name: string; email: string; age?: number }) {
  return await User.create(data);
}

export async function updateUser(id: string, data: Partial<{ name: string; email: string; age?: number }>) {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new Error("User not found");
  return user;
}

export async function patchUser(id: string, data: Partial<{ name: string; email: string; age?: number }>) {
  const user = await User.findByIdAndUpdate(id, { $set: data }, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new Error("User not found");
  return user;
}

export async function deleteUser(id: string) {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error("User not found");
  return user;
}
