// // app/projects/layout.tsx
// import { ReactNode } from 'react';
// import Link from 'next/link';

// export default function ProjectsLayout({ children }: { children: ReactNode }) {
//   return (
//     <section className="flex h-screen">
//       {/* --- SideNav --- */}
//       <aside className="w-64 border-r bg-white p-4">
//         <h2 className="mb-4 text-xl font-bold">Projects</h2>
//         <nav className="space-y-2">
//           <Link href="/projects" className="block rounded px-2 py-1 hover:bg-zinc-100">
//             一覧
//           </Link>
//           <Link href="/projects/new" className="block rounded px-2 py-1 hover:bg-zinc-100">
//             新規作成
//           </Link>
//         </nav>
//       </aside>

//       {/* --- Main content --- */}
//       <main className="flex-1 overflow-y-auto p-6">{children}</main>
//     </section>
//   );
// }

// app/projects/layout.tsx
import type { ReactNode } from 'react';

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;      // 何も追加しない
}
