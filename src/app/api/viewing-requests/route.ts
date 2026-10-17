import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Please sign in to request a viewing.' }, { status: 401 });

  const { name, email, phone, preferredDate, message, propertyId } = await req.json();
  if (!name || !email || !propertyId) {
    return NextResponse.json({ message: 'Name, email, and property are required.' }, { status: 400 });
  }

  const viewing = await prisma.viewingRequest.create({
    data: { name, email, phone: phone || null, preferredDate: preferredDate || null, message: message || null, propertyId },
  });
  return NextResponse.json({ success: true, id: viewing.id }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const role = (session.user as any).role;
  const userId = (session.user as any).id;

  const where = role === 'ADMIN'
    ? {}
    : { property: { agentId: userId } };

  const requests = await prisma.viewingRequest.findMany({
    where,
    include: { property: { select: { title: true, mainImage: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(requests);
}
