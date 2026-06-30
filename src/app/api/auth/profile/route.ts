import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/app/services/authService";
import { getSession } from "@/app/lib/session";
import { UpdateProfileSchema } from "@/app/lib/validations";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getProfile(session.userId);
    return NextResponse.json({ user });
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const user = await updateProfile(session.userId, parsed.data as { name?: string; phone?: string; age?: number });
    return NextResponse.json({ user, message: "Profile updated successfully" });
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
