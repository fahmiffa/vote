import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";

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
  const image = formData.get("image");
  const name = formData.get("name");

  if (!image || !(image instanceof File)) {
    return NextResponse.json({ success: false, message: "File tidak valid" }, { status: 400 });
  }

  if (!name || typeof name !== "string") {
    return NextResponse.json({ success: false, message: "Nama tidak valid" }, { status: 400 });
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${image.name}`;
  const uploadDir = path.join(process.cwd(), "public", "upload");
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/upload/${fileName}`;

    const updatedUser = await prisma.candidate.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        img: fileUrl,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to update user ${error}` }, { status: 500 });
  }
}
