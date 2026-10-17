import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'ADMIN') return null;
  return session;
}

export async function GET() {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true, _count: { select: { properties: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });

  const { userId, role } = await req.json();
  if (!userId || !['USER', 'AGENT', 'ADMIN'].includes(role)) {
    return NextResponse.json({ message: 'Invalid data.' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
  return NextResponse.json({ success: true, user });
}
