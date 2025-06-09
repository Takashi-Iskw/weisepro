// app/projects/[projectId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ThreadSection from './ThreadSection';

export const dynamic = 'force-dynamic'

export default async function ProjectTop({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
        {project.prompt && (
          <p className="whitespace-pre-wrap">{project.prompt}</p>
        )}
      </header>

      {/* 👇 ここが今回の追加分 */}
      <ThreadSection projectId={project.id} />
    </div>
  );
}
