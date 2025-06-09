// // app/projects/[projectId]/threads/[threadId]/page.tsx
// import { prisma } from '@/lib/prisma';
// import ChatSection from './ChatSection';
// import { notFound } from 'next/navigation';

// export default async function ThreadPage({
//   params,
// }: {
//   params: { id: string; threadId: string };
// }) {
//   const { id: projectId, threadId } = params;

//   // ① thread が project 配下に存在するか確認
//   const thread = await prisma.thread.findUnique({
//     where: { id: threadId, projectId }, // Composite PK でない場合はあとで belongsTo check でも可
//     include: { messages: { orderBy: { createdAt: 'asc' } } },
//   });
//   if (!thread) notFound();

//   const initialMessages = thread.messages.map((m) => ({
//     id: m.id,
//     role: m.role as 'user' | 'assistant',
//     content: m.content,
//   }));

//   return (
//     <ChatSection
//       key={threadId}            // thread 切替時に useChat を再初期化
//       projectId={projectId}
//       threadId={threadId}
//       initialMessages={initialMessages}
//     />
//   );
// }


// app/projects/[projectId]/threads/[threadId]/page.tsx
import { prisma } from '@/lib/prisma';
import ChatSection from './ChatSection';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'

export default async function ThreadPage({
  params,
}: {
  params: { id: string; threadId: string };
}) {
  const { id: projectId, threadId } = params;

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!thread || thread.projectId !== projectId) notFound();

  const initialMessages = thread.messages.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* ==== タイトル表示エリア ==== */}
      <header className="p-4 border-b bg-zinc-50">
        <h2 className="text-xl font-bold text-black">{thread.title || 'Untitled'}</h2>
      </header>

      {/* ==== チャット本体 ==== */}
      <ChatSection
        key={threadId}
        projectId={projectId}
        threadId={threadId}
        initialMessages={initialMessages}
      />
    </div>
  );
}
