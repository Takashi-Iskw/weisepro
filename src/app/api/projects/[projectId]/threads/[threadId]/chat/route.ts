import { prisma } from '@/lib/prisma';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string; threadId: string } },
) {
  const { messages } = await req.json();
  const { projectId, threadId } = params;

  // ① system プロンプト
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  const systemPrompt = project?.prompt ?? '';

  // ② ユーザーメッセージを保存
  const last = messages[messages.length - 1];
  await prisma.message.create({
    data: { threadId, role: last.role, content: last.content },
  });

  // ③ OpenAI ストリーミング
  const result = await streamText({
    model: openai('gpt-4o-mini-2024-07-18'),
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages,
    ],
    onFinish: async ({ text }) => {
      await prisma.message.create({
        data: { threadId, role: 'assistant', content: text },
      });
    },
  });

  return result.toDataStreamResponse();
}
