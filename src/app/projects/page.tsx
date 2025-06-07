// app/projects/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Project } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  // const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  const projects: Project[] = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">プロジェクト一覧</h1>
      <ul className="space-y-2">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${p.id}`}
              className="block rounded border p-2 hover:bg-zinc-50"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
