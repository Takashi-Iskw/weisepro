// app/api/projects/[projectId]/threads/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: { projectId: string } }) {
  const threads = await prisma.thread.findMany({
    where: { projectId: params.projectId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true },
  });
  return NextResponse.json(threads);
}

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const { title } = (await req.json()) as { title?: string };
  const thread = await prisma.thread.create({
    data: {
      projectId: params.projectId,
      title: title?.trim() || 'Untitled',
    },
  });
  return NextResponse.json({ id: thread.id });
}
