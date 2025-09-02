import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const users = await prisma.candidate.findMany();
    const safeUsers = users.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      img: item.img,
    }));

    return NextResponse.json({ success: true, users: safeUsers });
  } catch (e) {
    console.error(e);
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

  if (!image || !(image instanceof File)) {
    return NextResponse.json({ success: false, message: 'File tidak valid' }, { status: 400 });
  }

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ success: false, message: 'Nama tidak valid' }, { status: 400 });
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${image.name}`;
  const uploadDir = path.join(process.cwd(), 'public', 'upload');
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/upload/${fileName}`;

    await prisma.candidate.create({
      data: { name, img : fileUrl },
    })

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

