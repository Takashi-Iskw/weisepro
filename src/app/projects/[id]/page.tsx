// app/projects/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = { params: { id: string } };

export default async function ProjectDetailPage({ params }: Props) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">{project.name}</h1>
      <p className="text-zinc-700">{project.prompt}</p>
      {/* さらに Thread や Message をここに配置予定 */}
    </>
  );
}
