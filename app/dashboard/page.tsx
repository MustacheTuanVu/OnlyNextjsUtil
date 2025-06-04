import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Chào mừng, {session?.user?.name}!
        </h1>
        <p className="text-gray-600">
          Đây là trang Dashboard của bạn.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Dashboard
        </h2>
        <p className="text-lg text-gray-600">
          Nội dung dashboard sẽ được thêm vào ở đây.
        </p>
      </div>
    </div>
  );
}
