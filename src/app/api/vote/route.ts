import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const users = await prisma.head.findMany({
      include: {
        votes: {
          include: {
            candidate: true,
          },
        },
      },
    });
    const safeUsers = users.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      img: item.img,
      status: item.status,
      votes: item.votes.map((vote) => ({
        id: vote.id,
        candidate: {
          id: vote.candidate.id,
          name: vote.candidate.name,
          img: vote.candidate.img,
        },
      })),
    }));

    return NextResponse.json({ success: true, users: safeUsers });
  } catch {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get('image');
  const name = formData.get('name');
  const calonr = formData.get('calon');

  if (!image || !(image instanceof File)) {
    return NextResponse.json({ success: false, message: 'File tidak valid' }, { status: 400 });
  }

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ success: false, message: 'Nama tidak valid' }, { status: 400 });
  }


  let calon: number[] = [];
  if (calonr) {
    try {
      calon = JSON.parse(calonr.toString());
    } catch {
      console.error("Gagal parse calon:", calonr);
    }
  }



  try {

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${image.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'upload');
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/upload/${fileName}`;

    const head = await prisma.head.create({
      data: { name, img: fileUrl, status: 1 },
    })

    for (let index = 0; index < calon.length; index++) {
      await prisma.vote.create({
        data: { candidateId: calon[index], headId: head.id }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Upload berhasil',
      url: fileUrl,
      name,
    });
  } catch (error) {
    console.error('Error simpan file:', error);
    return NextResponse.json({ success: false, message: 'Gagal simpan file' }, { status: 500 });
  }
}

