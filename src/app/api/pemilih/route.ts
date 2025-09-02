import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { name, kelas } = await req.json()
  try {
    await prisma.peserta.create({
      data: { name : name, kelas : kelas, status : 0 },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }
}

export async function GET() {
  try {
    const users = await prisma.peserta.findMany();
    const safeUsers = users.map(item => ({
        id: item.id,
        name: item.name ?? '',
        kelas : item.kelas ?? '',
        status : item.status
    }));
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }
}
