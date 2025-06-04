'use client';

import { useState, useTransition } from 'react';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { updateEntityStatus, deleteEntity } from '@/actions/entity';
import { toast } from 'react-hot-toast';

// Type definitions
interface EntityCardProps {
  entity: {
    _id: string;
    title: string;
    description?: string;
    status: 'active' | 'inactive' | 'archived';
    createdAt: string;
    updatedAt: string;
  };
  onUpdate?: () => void;
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'archived';
}

// Status badge component
function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      label: 'Active'
    },
    inactive: {
      color: 'bg-yellow-100 text-yellow-800', 
      label: 'Inactive'
    },
    archived: {
      color: 'bg-gray-100 text-gray-800',
      label: 'Archived'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

// Main component
export function EntityCard({ entity, onUpdate }: EntityCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateEntityStatus(entity._id, newStatus);
        toast.success('Status updated successfully');
        onUpdate?.();
      } catch (error) {
        toast.error('Failed to update status');
        console.error('Status update error:', error);
      }
    });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteEntity(entity._id);
        toast.success('Item deleted successfully');
        onUpdate?.();
      } catch (error) {
        toast.error('Failed to delete item');
        console.error('Delete error:', error);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {entity.title}
          </h3>
          {entity.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {entity.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <StatusBadge status={entity.status} />
          
          {/* Actions menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              disabled={isPending}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {/* Handle view */}}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  
                  <button
                    onClick={() => {/* Handle edit */}}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  
                  <div className="border-t border-gray-100 my-1" />
                  
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {['active', 'inactive', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isPending || entity.status === status}
              className={`
                px-3 py-1 text-xs font-medium rounded-full transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${entity.status === status
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="text-xs text-gray-500">
          {new Date(entity.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Grid layout component
interface EntityGridProps {
  entities: EntityCardProps['entity'][];
  loading?: boolean;
  onUpdate?: () => void;
}

export function EntityGrid({ entities, loading = false, onUpdate }: EntityGridProps) {
  if (loading) {
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

  if (entities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No items found</div>
        <p className="text-gray-500">Create your first item to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entities.map((entity) => (
        <EntityCard
          key={entity._id}
          entity={entity}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

// Form component
interface EntityFormProps {
  entity?: EntityCardProps['entity'];
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function EntityForm({ entity, onSubmit, onCancel }: EntityFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: entity?.title || '',
    description: entity?.description || '',
    status: entity?.status || 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    startTransition(async () => {
      try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('status', formData.status);

        if (entity) {
          // Update existing
          // await updateEntity(entity._id, data);
          toast.success('Item updated successfully');
        } else {
          // Create new
          // await createEntity(data);
          toast.success('Item created successfully');
        }
        
        onSubmit?.();
      } catch (error) {
        toast.error(entity ? 'Failed to update item' : 'Failed to create item');
        console.error('Form submit error:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          placeholder="Enter title..."
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          disabled={isPending}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          placeholder="Enter description..."
          maxLength={1000}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isPending || !formData.title.trim()}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {entity ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            entity ? 'Update' : 'Create'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 