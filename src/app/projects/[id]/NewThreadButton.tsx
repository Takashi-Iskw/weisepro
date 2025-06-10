'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = { projectId: string };

export default function NewThreadButton({ projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleCreate() {
    if (!title.trim()) return;

    startTransition(async () => {
      const res = await fetch(
        `/api/projects/${projectId}/threads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        },
      );

      if (!res.ok) {
        // TODO: エラーハンドリングを好みで
        return;
      }

      const { id } = await res.json();
      router.push(`/projects/${projectId}/threads/${id}`);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-[#00FF7F] px-3 py-1 font-semibold hover:bg-[#00e96f]"
      >
        + New Thread
      </button>

      {open && (
        <div className="fixed inset-0 grid place-items-center bg-black/50 z-50">
          <div className="w-80 space-y-4 rounded bg-white p-6">
            <h3 className="text-lg font-bold">新しいスレッド</h3>

            <input
              autoFocus
              className="w-full rounded border px-2 py-1"
              placeholder="スレッドタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded px-3 py-1 text-zinc-600 hover:bg-zinc-100"
              >
                キャンセル
              </button>
              <button
                disabled={isPending}
                onClick={handleCreate}
                className="rounded bg-[#00FF7F] px-3 py-1 font-semibold hover:bg-[#00e96f] disabled:opacity-50"
              >
                作成
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
