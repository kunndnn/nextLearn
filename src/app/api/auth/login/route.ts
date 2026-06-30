import { NextResponse } from "next/server";
import { login } from "@/app/services/authService";
import { createSession } from "@/app/lib/session";
import { LoginSchema } from "@/app/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const user = await login(parsed.data as { email: string; password: string });
    await createSession(user.id);

    return NextResponse.json({ user, message: "Logged in successfully" });
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
