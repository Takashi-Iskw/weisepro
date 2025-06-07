import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 10;               // 1ページあたり表示件数

type SearchParams = { page?: string };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // ページ番号（?page=2 等）。未指定は 1
  const currentPage = Math.max(1, Number(searchParams.page ?? '1'));

  const [total, projects] = await Promise.all([
    prisma.project.count(),
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, prompt: true },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>

      {/* 一覧カード */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.id} className="border rounded-xl p-4 shadow-sm">
            <Link href={`/projects/${p.id}`} className="block hover:opacity-80 h-full">
              <h2 className="font-semibold text-lg mb-2 truncate">{p.name}</h2>
              {p.prompt && (
                <p className="text-sm text-zinc-100 line-clamp-3 whitespace-pre-wrap">
                  {p.prompt}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* ページング */}
      <Pagination current={currentPage} totalPages={totalPages} />
    </div>
  );
}

/* ⚡ 小さなコンポーネント。別ファイルに切ってもOK */
function Pagination({
  current,
  totalPages,
}: {
  current: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const makeHref = (page: number) => `/projects?page=${page}`;

  const prev = current > 1 ? current - 1 : null;
  const next = current < totalPages ? current + 1 : null;

  return (
    <nav className="flex justify-center gap-4 mt-8">
      <PageLink href={prev ? makeHref(prev) : undefined}>← Prev</PageLink>

      {/* 3ページ以内だけ番号を出す簡易版 */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        if (
          page === 1 ||
          page === totalPages ||
          Math.abs(page - current) <= 1
        ) {
          return (
            <PageLink
              key={page}
              href={makeHref(page)}
              isActive={page === current}
            >
              {page}
            </PageLink>
          );
        }
        return page === current - 2 || page === current + 2 ? (
          <span key={page}>…</span>
        ) : null;
      })}

      <PageLink href={next ? makeHref(next) : undefined}>Next →</PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  isActive = false,
}: {
  href?: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  if (!href) {
    return (
      <span className="px-3 py-1 rounded text-zinc-400 select-none">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-zinc-100 hover:bg-zinc-200'
      }`}
    >
      {children}
    </Link>
  );
}
