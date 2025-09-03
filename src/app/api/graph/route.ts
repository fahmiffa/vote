import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET() {
  try {
    const users = await prisma.res.findMany({
      include: {
        candidate: true,
        head: true
      },
    });

    const head = users.map((item) => ({
      id: item.id,
      
      head : item.headId,
      headName : item.head.name,
      headImg : item.head.img,
      candidate : item.candidateId,
      candidateName : item.candidate.name,
      candidateImg : item.candidate.img,
    }));

    const n = await prisma.peserta.count();
    const come = await prisma.res.count();

    return NextResponse.json({ success: true, item: head, total : n, masuk : come });
  } catch {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

