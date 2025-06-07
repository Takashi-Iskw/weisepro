// app/projects/[projectId]/layout.tsx
// import ProjectSidebar from './ProjectSidebar';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="flex h-screen">
      {/* 左：スレッド一覧 */}
      {/* <ProjectSidebar projectId={params.id} className="w-64 border-r" /> */}
      {/* 右：スレッド or 概要 */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
