import { NextResponse } from "next/server";
import { forgotPassword } from "@/app/services/authService";
import { ForgotPasswordSchema } from "@/app/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await forgotPassword((parsed.data as { email: string }).email);
    return NextResponse.json(result);
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
