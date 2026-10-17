import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });

  const { status, featured } = await req.json();
  const data: any = {};
  if (status) data.status = status;
  if (typeof featured === 'boolean') data.featured = featured;

  const property = await prisma.property.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ success: true, property });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });

  await prisma.property.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
