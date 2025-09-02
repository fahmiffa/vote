import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.candidate.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete user ${error}` }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const formData = await request.formData();
  const image = formData.get('image');
  const name = formData.get('name');

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ success: false, message: 'Nama tidak valid' }, { status: 400 });
  }

  let fileUrl = null;

  if (image && image instanceof File) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${image.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'upload');
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);
    fileUrl = `/upload/${fileName}`;
  }

  try {
    let res;
    if (fileUrl) {
      res = await prisma.candidate.update({
        where: { id: Number(id) },
        data: { name, img: fileUrl },
      });
    } else {
      res = await prisma.candidate.update({
        where: { id: Number(id) },
        data: { name },
      });
    }

    return NextResponse.json({ user: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to update user ${error}` }, { status: 500 });
  }
}
