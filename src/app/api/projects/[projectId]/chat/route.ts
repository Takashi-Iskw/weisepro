import { prisma } from '@/lib/prisma';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const dynamic = 'force-dynamic'

export const runtime = 'nodejs';          // ← Prisma なので Node.js

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } },
) {
  const { messages } = await req.json();
  const projectId = params.projectId;

  // ① Project.prompt を取得
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  const systemPrompt = project?.prompt ?? '';

  // --- ① ユーザーメッセージを DB 保存 ---
  let thread = await prisma.thread.findFirst({ where: { projectId } });
  if (!thread) {
    thread = await prisma.thread.create({
      data: { projectId, title: 'default' },
    });
  }
  const last = messages[messages.length - 1];
  await prisma.message.create({
    data: { threadId: thread.id, role: last.role, content: last.content },
  });

  // --- ② OpenAI へストリーミング ---
  const result = await streamText({
  // ✅ モデル側には追加オプションなし
  model: openai('gpt-4o-mini-2024-07-18'),
  messages: [
    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
    ...messages,
  ],
  /** ストリーム完了後に全文が渡される */
  onFinish: async ({ text }) => {
    await prisma.message.create({
      data: { threadId: thread.id, role: 'assistant', content: text },
    });
  },
});

  // --- ③ クライアントへ返却 ---
  return result.toDataStreamResponse();   // v4 の標準レスポンス
}

