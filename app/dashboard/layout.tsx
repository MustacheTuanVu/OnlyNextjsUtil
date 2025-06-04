import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={session.user?.name || 'User'} />
      
      <main className="flex-1 overflow-hidden lg:ml-0">
        <div className="h-full overflow-y-auto">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
