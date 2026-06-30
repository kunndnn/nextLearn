"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/authStore";
import { Input, Button } from "@/app/components/ui";
import { UpdateProfileSchema, ChangePasswordSchema, getFieldErrors, type FieldErrors } from "@/app/lib/validations";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, fetchProfile, logout, updateProfile, changePassword } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [profileFieldErrors, setProfileFieldErrors] = useState<FieldErrors>({});
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<FieldErrors>({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAge(user.age?.toString() || "");
    }
  }, [user]);

  async function handleProfileUpdate(e: FormEvent) {
    e.preventDefault();
    setProfileFieldErrors({});

    const parsed = UpdateProfileSchema.safeParse({ name, phone: phone || undefined, age: age ? Number(age) : undefined });
    const errors = getFieldErrors(parsed);
    if (errors) {
      setProfileFieldErrors(errors);
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({ name, phone: phone || undefined, age: age ? Number(age) : undefined });
      toast.success("Profile updated");
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setProfileFieldErrors(serverErrors);
      } else {
        toast.error(err.response?.data?.error || "Update failed");
      }
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordFieldErrors({});

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const parsed = ChangePasswordSchema.safeParse({ currentPassword, newPassword });
    const errors = getFieldErrors(parsed);
    if (errors) {
      setPasswordFieldErrors(errors);
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setPasswordFieldErrors(serverErrors);
      } else {
        toast.error(err.response?.data?.error || "Failed to change password");
      }
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (loading) {
    return <div className="max-w-md mx-auto mt-10 p-6 text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded text-center">
        <p className="mb-4">Please login to view your profile</p>
        <Link href="/login"><Button>Login</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <div className="p-6 border rounded">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{user.email}</p>
        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-3">
          <div>
            <Input placeholder="Name" value={name} onChange={(e) => { setName(e.target.value); setProfileFieldErrors({}); }} />
            {profileFieldErrors.name?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
          </div>
          <div>
            <Input placeholder="Phone" value={phone} onChange={(e) => { setPhone(e.target.value); setProfileFieldErrors({}); }} />
            {profileFieldErrors.phone?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
          </div>
          <div>
            <Input placeholder="Age" type="number" value={age} onChange={(e) => { setAge(e.target.value); setProfileFieldErrors({}); }} />
            {profileFieldErrors.age?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
          </div>
          <Button type="submit" disabled={profileLoading}>{profileLoading ? "Saving..." : "Save Profile"}</Button>
        </form>
      </div>

      <div className="p-6 border rounded">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
          <div>
            <Input placeholder="Current Password" type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setPasswordFieldErrors({}); }} />
            {passwordFieldErrors.currentPassword?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
          </div>
          <div>
            <Input placeholder="New Password" type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPasswordFieldErrors({}); }} />
            {passwordFieldErrors.newPassword?.map((msg) => <p key={msg} className="text-red-500 text-xs mt-0.5">{msg}</p>)}
          </div>
          <Input placeholder="Confirm New Password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          <Button type="submit" disabled={passwordLoading}>{passwordLoading ? "Changing..." : "Change Password"}</Button>
        </form>
      </div>
    </div>
  );
}
