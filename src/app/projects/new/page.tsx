// app/projects/new/page.tsx
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const metadata = { title: '新規プロジェクト作成' };

export const dynamic = 'force-dynamic'

export default function NewProjectPage() {
  // -------- Server Action --------
  async function createProject(formData: FormData) {
    'use server';                         // ★ これでサーバ側で実行
    const name   = formData.get('name')?.toString().trim();
    const prompt = formData.get('prompt')?.toString().trim() || null;

    if (!name) {
      // バリデーション失敗時は簡易に throw して 400
      throw new Error('プロジェクト名は必須です');
    }

    const project = await prisma.project.create({
      data: { name, prompt },
    });

    // 一覧などを ISR している場合にキャッシュ破棄
    revalidatePath('/projects');

    // 作成した詳細ページへリダイレクト
    redirect(`/projects/${project.id}`);
  }

  // -------- UI --------
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-3xl font-bold">新規プロジェクト作成</h1>

      <form action={createProject} className="space-y-6">
        {/* プロジェクト名 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            プロジェクト名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="例）次世代 AI チャット基盤"
          />
        </div>

        {/* 共通プロンプト（任意） */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium">
            共通プロンプト（任意）
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="ChatGPT へのデフォルト指示をここに書く…"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          作成
        </button>
      </form>
    </main>
  );
}
