import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { email, password, name, role } = await req.json()
  console.log(role)
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    await prisma.user.create({
      data: { email, name, password: hashedPassword, role },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const safeUsers = users.map(user => ({
        id: user.id,
        name: user.name ?? '',
        email: user.email,
        role : user.role,
    }));
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }
}
