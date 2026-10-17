import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([]);

  const favorites = await prisma.favorite.findMany({
    where: { userId: (session.user as any).id },
    select: { propertyId: true },
  });
  return NextResponse.json(favorites.map((f) => f.propertyId));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { propertyId } = await req.json();
  if (!propertyId) return NextResponse.json({ message: 'Property ID required' }, { status: 400 });

  const userId = (session.user as any).id;
  try {
    await prisma.favorite.create({
      data: { userId, propertyId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ success: true, message: 'Already favorited' });
    }
    throw error;
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { propertyId } = await req.json();
  if (!propertyId) return NextResponse.json({ message: 'Property ID required' }, { status: 400 });

  await prisma.favorite.deleteMany({
    where: { userId: (session.user as any).id, propertyId },
  });
  return NextResponse.json({ success: true });
}
