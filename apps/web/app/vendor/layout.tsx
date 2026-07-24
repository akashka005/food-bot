import { auth } from '@smartfood/auth';
import { redirect } from 'next/navigation';
import DashboardNav from '@/components/dashboard/nav';
import VendorSidebar from '@/components/dashboard/vendor-sidebar';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect('/login');
  if (session.user.role !== 'VENDOR') redirect('/unauthorized');

  return (
    <div className="min-h-screen bg-background flex">
      <VendorSidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNav user={session.user} />
        <main className="flex-1 p-6 overflow-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
