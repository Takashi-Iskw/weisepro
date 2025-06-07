import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Sidebar() {
  // タイトルだけを取得。多くてもせいぜい数百件なら全部読んでも OK
  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 h-screen overflow-y-auto p-4">
      <Link href="/projects/new" className="block mb-6 text-blue-600 font-semibold">
        + New Project
      </Link>

      <ul className="space-y-2 pr-1">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${p.id}`}
              className="block truncate hover:text-blue-600"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
