// app/projects/[projectId]/ThreadSection.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

export const dynamic = 'force-dynamic'

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ThreadSection({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { data: threads, mutate } = useSWR<
    { id: string; title: string | null }[]
  >(`/api/projects/${projectId}/threads`, fetcher);

  const createThread = async () => {
    const title = window.prompt('スレッド名を入力してください', '');
    if (!title) return; // キャンセル or 空文字

    const res = await fetch(`/api/projects/${projectId}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const { id } = await res.json();
    await mutate();                              // 一覧リロード
    router.push(`/projects/${projectId}/threads/${id}`); // 詳細へ
  };

  return (
    <section className="space-y-4">
      <button
        onClick={createThread}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + New Thread
      </button>

      <ul className="space-y-2">
        {threads && threads.length ? (
          threads.map((t) => (
            <li key={t.id}>
              <Link
                href={`/projects/${projectId}/threads/${t.id}`}
                className="block border rounded px-3 py-2 hover:bg-zinc-100 truncate"
              >
                {t.title || 'Untitled'}
              </Link>
            </li>
          ))
        ) : (
          <li className="text-zinc-500">スレッドはまだありません</li>
        )}
      </ul>
    </section>
  );
}
