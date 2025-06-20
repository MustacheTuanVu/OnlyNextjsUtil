import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Shield, Database, Smartphone } from 'lucide-react';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            OnlyNextjs Util
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ứng dụng quản lý hiện đại được xây dựng với Next.js 15, NextAuth và MongoDB. 
            Đăng nhập dễ dàng với Google để bắt đầu sử dụng ngay!
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Bảo mật cao</h3>
            <p className="text-gray-600">
              Xác thực an toàn với Google OAuth và NextAuth, bảo vệ thông tin cá nhân
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Database className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">MongoDB Integration</h3>
            <p className="text-gray-600">
              Tương tác trực tiếp với MongoDB thông qua Server Actions
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Smartphone className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
            <p className="text-gray-600">
              Giao diện thân thiện trên cả desktop và mobile với Tailwind CSS
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Link 
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Đăng nhập với Google
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            Sử dụng tài khoản Google của bạn để đăng nhập nhanh chóng và an toàn
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Công nghệ sử dụng</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="font-semibold">Next.js 15</div>
              <div className="text-sm text-gray-500">App Router</div>
            </div>
            <div className="p-4">
              <div className="font-semibold">Google OAuth</div>
              <div className="text-sm text-gray-500">Authentication</div>
            </div>
            <div className="p-4">
              <div className="font-semibold">MongoDB</div>
              <div className="text-sm text-gray-500">Database</div>
            </div>
            <div className="p-4">
              <div className="font-semibold">TypeScript</div>
              <div className="text-sm text-gray-500">Type Safety</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
