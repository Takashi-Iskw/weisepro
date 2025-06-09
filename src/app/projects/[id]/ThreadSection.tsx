// // app/projects/[projectId]/ThreadSection.tsx
// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import useSWR from 'swr';

// export const dynamic = 'force-dynamic'

// const fetcher = (url: string) => fetch(url).then((r) => r.json());

// export default function ThreadSection({ projectId }: { projectId: string }) {
//   const router = useRouter();
//   const { data: threads, mutate } = useSWR<
//     { id: string; title: string | null }[]
//   >(`/api/projects/${projectId}/threads`, fetcher);

//   const createThread = async () => {
//     const title = window.prompt('スレッド名を入力してください', '');
//     if (!title) return; // キャンセル or 空文字

//     const res = await fetch(`/api/projects/${projectId}/threads`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ title }),
//     });
//     const { id } = await res.json();
//     await mutate();                              // 一覧リロード
//     router.push(`/projects/${projectId}/threads/${id}`); // 詳細へ
//   };

//   return (
//     <section className="space-y-4">
//       <button
//         onClick={createThread}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         + New Thread
//       </button>

//       <ul className="space-y-2">
//         {threads && threads.length ? (
//           threads.map((t) => (
//             <li key={t.id}>
//               <Link
//                 href={`/projects/${projectId}/threads/${t.id}`}
//                 className="block border rounded px-3 py-2 hover:bg-zinc-100 truncate"
//               >
//                 {t.title || 'Untitled'}
//               </Link>
//             </li>
//           ))
//         ) : (
//           <li className="text-zinc-500">スレッドはまだありません</li>
//         )}
//       </ul>
//     </section>
//   );
// }



// app/projects/[projectId]/ThreadSection.tsx
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

type Props = { projectId: string };

export default async function ThreadSection({ projectId }: Props) {
  const threads = await prisma.thread.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true },
  });

  if (threads.length === 0) {
    return <p className="text-zinc-400">まだスレッドがありません。</p>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Threads</h2>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {threads.map((t) => (
          <li key={t.id}>
            <Link
              href={`/projects/${projectId}/threads/${t.id}`}
              className="project-card group block h-full hover:no-underline"
            >
              <h3 className="font-semibold text-lg mb-1 truncate text-[#00FF7F] group-hover:text-black">
                {t.title}
              </h3>

              <time className="text-xs text-zinc-400 group-hover:text-black">
                {new Date(t.createdAt).toLocaleString('ja-JP', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
