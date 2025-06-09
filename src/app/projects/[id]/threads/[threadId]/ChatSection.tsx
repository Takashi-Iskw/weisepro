// app/projects/[projectId]/threads/[threadId]/ChatSection.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic'

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

export default function ChatSection({
  projectId,
  threadId,
  initialMessages,
}: {
  projectId: string;
  threadId: string;
  initialMessages: ChatMessage[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/projects/${projectId}/threads/${threadId}/chat`,
    initialMessages,
    id: threadId, // ← useChat 内部キャッシュを thread 単位で分離
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 text-black">
        {messages.map((m) => (
          <MessageCard key={m.id} role={m.role} content={m.content} />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="メッセージを入力..."
          className="flex-1 rounded border px-3 py-2 text-black"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 text-black px-4 py-2 rounded disabled:opacity-50"
        >
          送信
        </button>
      </form>
    </div>
  );
}

function MessageCard({ role, content }: { role: string; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={cn('rounded-xl p-3 shadow', isUser ? 'bg-blue-100 self-end' : 'bg-zinc-100 self-start')}>
      {content}
    </div>
  );
}
