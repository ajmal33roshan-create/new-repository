import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Please sign in to submit an inquiry.' }, { status: 401 });

  const { name, email, phone, message, propertyId, agentId } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ message: 'Name, email, and message are required.' }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: { name, email, phone: phone || null, message, propertyId: propertyId || null, agentId: agentId || null },
  });
  return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  const where = role === 'ADMIN' ? {} : { agentId: userId };
  const inquiries = await prisma.inquiry.findMany({
    where,
    include: { property: { select: { title: true, mainImage: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(inquiries);
}
