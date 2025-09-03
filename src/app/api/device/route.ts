import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    await prisma.device.update({
      where: { id: 1 },
      data: data
    });
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Update Failed" }, { status: 400 })
  }
}


export async function GET() {
  try {
    const users = await prisma.device.findMany({
    });
    const safeUsers = users.map((item) => ({
      id: item.id,
      man: item.primary,
      men: item.secondary
    }));

    return NextResponse.json({ success: true, item: safeUsers });
  } catch {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}