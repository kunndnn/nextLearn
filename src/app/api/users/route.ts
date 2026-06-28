import { getAllUsers, createUser } from "@/app/services/userService";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await createUser(body);
  return NextResponse.json(user, { status: 201 });
}
