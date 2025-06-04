import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getEntities, getEntityStats } from '@/actions/entity';
import { EntityGrid } from '@/components/EntityCard';
import { Modal } from '@/components/Modal';
import { Loading } from '@/components/Loading';
import { Plus, Search, Filter } from 'lucide-react';

// Page metadata
export const metadata = {
  title: 'Entities | Your App Name',
  description: 'Manage your entities',
};

// Statistics component
async function EntityStats() {
  try {
    const stats = await getEntityStats();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.inactive}</div>
          <div className="text-sm text-gray-600">Inactive</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          <div className="text-sm text-gray-600">Archived</div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load stats:', error);
    return null;
  }
}

// Entity list component
async function EntityList({ searchParams }: { searchParams: any }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  try {
    const entities = await getEntities(session.user.id);
    
    return <EntityGrid entities={entities} />;
  } catch (error) {
    console.error('Failed to load entities:', error);
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Failed to load items</div>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    );
  }
}

// Loading components
function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

function EntityListLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Search and filter component (client-side)
function SearchAndFilter() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search entities..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
        
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </button>
      </div>
    </div>
  );
}

// Main page component
export default async function EntitiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Entities
        </h1>
        <p className="text-gray-600">
          Manage and organize your entities with ease.
        </p>
      </div>

      {/* Statistics */}
      <Suspense fallback={<StatsLoading />}>
        <EntityStats />
      </Suspense>

      {/* Search and filters */}
      <SearchAndFilter />

      {/* Entity list */}
      <Suspense fallback={<EntityListLoading />}>
        <EntityList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Alternative page structure for different use cases

// 1. Simple page without stats
export async function SimpleEntitiesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const entities = await getEntities(session.user.id);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Entities</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add New
        </button>
      </div>

      <EntityGrid entities={entities} />
    </div>
  );
}

// 2. Page with client-side state management
export function ClientEntitiesPage() {
  // This would be a client component with useState, useEffect, etc.
  // Use this pattern when you need interactive features like:
  // - Real-time search/filtering
  // - Optimistic updates
  // - Complex state management
  
  return (
    <div className="p-6">
      {/* Client-side logic here */}
    </div>
  );
}

// 3. Page with error boundary
export function EntitiesPageWithErrorBoundary() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Entities</h1>
      
      <Suspense 
        fallback={<Loading />}
      >
        <EntityList searchParams={{}} />
      </Suspense>
    </div>
  );
} 