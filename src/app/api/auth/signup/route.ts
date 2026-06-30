import { NextResponse } from "next/server";
import { signup } from "@/app/services/authService";
import { createSession } from "@/app/lib/session";
import { SignupSchema } from "@/app/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const user = await signup(parsed.data as { name: string; email: string; password: string });
    await createSession(user.id);

    return NextResponse.json({ user, message: "Account created successfully" }, { status: 201 });
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
