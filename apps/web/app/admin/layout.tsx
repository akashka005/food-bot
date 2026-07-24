import { auth } from '@smartfood/auth';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/dashboard/nav';
import AdminSidebar from '@/components/dashboard/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/unauthorized');

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNav user={session.user} />
        <main className="flex-1 p-6 overflow-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
