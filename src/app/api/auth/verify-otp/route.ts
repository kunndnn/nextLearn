import { NextResponse } from "next/server";
import { verifyOTP } from "@/app/services/authService";
import { VerifyOTPSchema } from "@/app/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VerifyOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await verifyOTP((parsed.data as { email: string; otp: string }).email, (parsed.data as { email: string; otp: string }).otp);
    return NextResponse.json(result);
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
