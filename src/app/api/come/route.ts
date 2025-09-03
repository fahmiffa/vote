import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const {id, candidate} = await request.json()
  try {

    await prisma.res.create({
        data : {headId :id, candidateId : candidate}
    });
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: `Update Failed ${e}` }, { status: 400 })
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