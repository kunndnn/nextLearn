import { NextResponse } from "next/server";
import { changePassword } from "@/app/services/authService";
import { getSession } from "@/app/lib/session";
import { ChangePasswordSchema } from "@/app/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data as { currentPassword: string; newPassword: string };
    const result = await changePassword(session.userId, data.currentPassword, data.newPassword);
    return NextResponse.json(result);
  } catch (e) {
    const message = (e as Error).message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
