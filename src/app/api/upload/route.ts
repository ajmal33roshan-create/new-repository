import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll('files').filter((f) => f instanceof File) as File[];

  if (files.length === 0) {
    return NextResponse.json({ message: 'No files provided.' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: `File ${file.name} exceeds 5MB limit.` }, { status: 400 });
    }
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    urls.push(`/uploads/${filename}`);
  }

  return NextResponse.json({ urls }, { status: 201 });
}
