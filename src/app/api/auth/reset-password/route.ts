import { NextResponse } from "next/server";
import { resetPassword } from "@/app/services/authService";
import { ResetPasswordSchema } from "@/app/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data as { email: string; otp: string; password: string };
    const result = await resetPassword(data.email, data.otp, data.password);
    return NextResponse.json(result);
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
