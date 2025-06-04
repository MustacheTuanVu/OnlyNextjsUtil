# Developer Integration Guide

Hướng dẫn chi tiết để tích hợp chức năng mới vào OnlyNextjs Util - Framework utility đa mục đích.

## 📖 Tổng quan

OnlyNextjs Util là một framework utility được xây dựng trên Next.js 15 với mục tiêu tạo ra một nền tảng dễ mở rộng cho các ứng dụng web hiện đại. Dự án sử dụng kiến trúc Server Actions và direct database interaction để đảm bảo hiệu suất cao.

## 🏗️ Kiến trúc hệ thống

### Cấu trúc thư mục
```
OnlyNextjsUtil/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (NextAuth)
│   ├── dashboard/         # Protected pages
│   ├── login/             # Authentication pages
│   ├── register/          
│   ├── globals.css        
│   ├── layout.tsx         
│   └── page.tsx           
│
├── actions/               # Server Actions
│   ├── auth.ts           
│   └── profile.ts        
│
├── components/           # Reusable UI components
│   ├── ErrorBoundary.tsx 
│   ├── Loading.tsx       
│   ├── Modal.tsx         
│   ├── Sidebar.tsx       
│   └── Toast.tsx         
│
├── lib/                  # Core utilities
│   ├── auth.ts           # NextAuth config
│   └── mongodb.ts        # Database connection
│
├── models/              # MongoDB models
│   └── User.ts          
│
├── utils/               # Helper functions
│   ├── constants.ts     
│   ├── string.ts        
│   └── validation.ts    
│
└── types/               # TypeScript definitions
    └── next-auth.d.ts   
```

## 🚀 Bắt đầu tích hợp chức năng mới

### 1. Tạo Model mới

Khi bạn muốn thêm một entity mới (ví dụ: Task, Project, Habit), hãy tạo model trong thư mục `models/`:

```typescript
// models/Task.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
```

### 2. Tạo Server Actions

Tạo file action mới trong thư mục `actions/` để xử lý logic business:

```typescript
// actions/task.ts
'use server';

import dbConnect from '@/lib/mongodb';
import Task, { ITask } from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;

  if (!title?.trim()) {
    throw new Error('Title is required');
  }

  try {
    await dbConnect();

    const task = new Task({
      title: title.trim(),
      description: description?.trim(),
      priority,
      userId: session.user.id
    });

    await task.save();
    
    // Revalidate để cập nhật UI
    revalidatePath('/dashboard/tasks');
    
    return { success: true, task: task.toObject() };
  } catch (error) {
    console.error('Create task error:', error);
    throw new Error('Failed to create task');
  }
}

export async function getTasks(userId: string) {
  try {
    await dbConnect();
    
    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    
    return tasks;
  } catch (error) {
    console.error('Get tasks error:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    await dbConnect();
    
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: session.user.id },
      { status },
      { new: true }
    );

    if (!task) {
      throw new Error('Task not found');
    }

    revalidatePath('/dashboard/tasks');
    return { success: true, task: task.toObject() };
  } catch (error) {
    console.error('Update task error:', error);
    throw new Error('Failed to update task');
  }
}

export async function deleteTask(taskId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    await dbConnect();
    
    const result = await Task.findOneAndDelete({
      _id: taskId,
      userId: session.user.id
    });

    if (!result) {
      throw new Error('Task not found');
    }

    revalidatePath('/dashboard/tasks');
    return { success: true };
  } catch (error) {
    console.error('Delete task error:', error);
    throw new Error('Failed to delete task');
  }
}
```

### 3. Tạo UI Components

Tạo các component UI có thể tái sử dụng trong thư mục `components/`:

```typescript
// components/TaskCard.tsx
'use client';

import { useState } from 'react';
import { Check, Clock, AlertCircle, Trash2, Edit } from 'lucide-react';
import { updateTaskStatus, deleteTask } from '@/actions/task';
import { toast } from 'react-hot-toast';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const [loading, setLoading] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    'in-progress': <AlertCircle className="w-4 h-4" />,
    completed: <Check className="w-4 h-4" />,
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateTaskStatus(task._id, newStatus);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await deleteTask(task._id);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {['pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={loading || task.status === status}
              className={`
                flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium
                transition-colors disabled:opacity-50
                ${task.status === status 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="capitalize">{status.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
        
        <span className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
```

### 4. Tạo Page và Layout

Tạo trang mới trong thư mục `app/dashboard/`:

```typescript
// app/dashboard/tasks/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTasks } from '@/actions/task';
import { TaskCard } from '@/components/TaskCard';
import { CreateTaskModal } from '@/components/CreateTaskModal';

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const tasks = await getTasks(session.user.id);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <CreateTaskModal />
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tasks yet</p>
          <CreateTaskModal />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5. Tích hợp với Sidebar Navigation

Cập nhật Sidebar để thêm navigation cho chức năng mới:

```typescript
// components/Sidebar.tsx (thêm vào navigation items)
const navigation = [
  // ... existing items
  {
    name: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    name: 'Projects', 
    href: '/dashboard/projects',
    icon: FolderOpen,
  },
  {
    name: 'Habits',
    href: '/dashboard/habits', 
    icon: Target,
  },
];
```

## 🎨 Styling Guidelines

### Tuân theo Design System

Dự án này được thiết kế với nguyên tắc tối giản và dễ sử dụng:

```css
/* Sử dụng màu sắc nhẹ nhàng */
.primary { @apply bg-blue-50 text-blue-700; }
.secondary { @apply bg-gray-50 text-gray-700; }
.accent { @apply bg-green-50 text-green-700; }

/* Typography tối giản */
.heading { @apply text-gray-900 font-medium; }
.body { @apply text-gray-600 leading-relaxed; }

/* Spacing hào phóng */
.spacing { @apply p-6 space-y-4; }
.container { @apply max-w-4xl mx-auto; }
```

### Sử dụng Component Patterns

```typescript
// Pattern cho forms
export function AppForm({ children, onSubmit }: AppFormProps) {
  return (
    <form onSubmit={onSubmit} className="spacing">
      <div className="space-y-4">
        {children}
      </div>
    </form>
  );
}

// Pattern cho cards
export function AppCard({ children, title }: AppCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="heading">{title}</h3>
        </div>
      )}
      <div className="spacing">
        {children}
      </div>
    </div>
  );
}
```

## 🔐 Security Best Practices

### 1. Authentication & Authorization

```typescript
// Luôn kiểm tra session trong Server Actions
export async function secureAction() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  
  // Action logic here
}

// Kiểm tra ownership của resource
export async function updateUserResource(resourceId: string) {
  const session = await getServerSession(authOptions);
  
  const resource = await Resource.findOne({
    _id: resourceId,
    userId: session.user.id  // Quan trọng!
  });
  
  if (!resource) {
    throw new Error('Resource not found');
  }
}
```

### 2. Input Validation

```typescript
// utils/validation.ts
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

// Sử dụng trong Server Actions
export async function createTask(formData: FormData) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
  };
  
  const validatedData = taskSchema.parse(data);
  // Continue with validated data
}
```

### 3. Error Handling

```typescript
// utils/errorHandler.ts
export function handleActionError(error: unknown) {
  console.error('Action error:', error);
  
  if (error instanceof z.ZodError) {
    return { success: false, error: 'Invalid input data' };
  }
  
  if (error instanceof mongoose.Error) {
    return { success: false, error: 'Database error' };
  }
  
  return { success: false, error: 'An unexpected error occurred' };
}
```

## 🧪 Testing Guidelines

### 1. Unit Tests cho Actions

```typescript
// __tests__/actions/task.test.ts
import { createTask, getTasks } from '@/actions/task';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

jest.mock('@/lib/mongodb');
jest.mock('@/models/Task');

describe('Task Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task successfully', async () => {
    const mockFormData = new FormData();
    mockFormData.append('title', 'Test Task');
    mockFormData.append('priority', 'high');

    (Task.prototype.save as jest.Mock).mockResolvedValue({
      _id: 'task-id',
      title: 'Test Task',
      priority: 'high',
    });

    const result = await createTask(mockFormData);
    
    expect(result.success).toBe(true);
    expect(result.task.title).toBe('Test Task');
  });
});
```

### 2. Component Tests

```typescript
// __tests__/components/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';

const mockTask = {
  _id: '1',
  title: 'Test Task',
  status: 'pending' as const,
  priority: 'medium' as const,
  createdAt: '2024-01-01',
};

describe('TaskCard', () => {
  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });
});
```

## 📊 Performance Optimization

### 1. Database Queries

```typescript
// Sử dụng projection để giảm data transfer
export async function getTasksSummary(userId: string) {
  return await Task.find({ userId })
    .select('title status priority createdAt')  // Chỉ lấy fields cần thiết
    .lean()  // Trả về plain objects thay vì Mongoose documents
    .sort({ createdAt: -1 })
    .limit(20);
}

// Sử dụng aggregation cho queries phức tạp
export async function getTaskStatistics(userId: string) {
  return await Task.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgPriority: { $avg: { $cond: [
          { $eq: ['$priority', 'high'] }, 3,
          { $cond: [{ $eq: ['$priority', 'medium'] }, 2, 1] }
        ]}}
      }
    }
  ]);
}
```

### 2. Caching Strategies

```typescript
// Sử dụng React cache cho server components
import { cache } from 'react';

export const getCachedTasks = cache(async (userId: string) => {
  return getTasks(userId);
});

// Sử dụng revalidatePath cho cache invalidation
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createTask(formData: FormData) {
  // ... create logic
  
  revalidatePath('/dashboard/tasks');
  revalidateTag('user-tasks');
}
```

### 3. Client-side Optimization

```typescript
// Sử dụng dynamic imports cho code splitting
import dynamic from 'next/dynamic';

const TaskModal = dynamic(() => import('@/components/TaskModal'), {
  loading: () => <div>Loading...</div>,
});

// Sử dụng React.memo cho expensive components
import { memo } from 'react';

export const TaskCard = memo(function TaskCard({ task }: TaskCardProps) {
  // Component logic
});
```

## 🔄 State Management

### 1. Server State với tanstack/react-query

```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

### 2. Client State với Zustand

```typescript
// stores/taskStore.ts
import { create } from 'zustand';

interface TaskStore {
  selectedTaskId: string | null;
  viewMode: 'grid' | 'list';
  filters: {
    status: string[];
    priority: string[];
  };
  setSelectedTask: (id: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  updateFilters: (filters: Partial<TaskStore['filters']>) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTaskId: null,
  viewMode: 'grid',
  filters: {
    status: [],
    priority: [],
  },
  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  updateFilters: (newFilters) => 
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),
}));
```

## 📱 Responsive Design

### 1. Mobile-first Approach

```typescript
// Sử dụng Tailwind breakpoints
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  lg:grid-cols-3 lg:gap-8
">
  {tasks.map(task => <TaskCard key={task.id} task={task} />)}
</div>
```

### 2. Touch-friendly Interactions

```typescript
// components/MobileTaskCard.tsx
export function MobileTaskCard({ task }: TaskCardProps) {
  return (
    <div className="
      p-4 bg-white rounded-lg shadow-sm
      active:scale-95 transition-transform
      min-h-[80px] # Minimum touch target
    ">
      {/* Card content */}
    </div>
  );
}
```

## 🌐 Internationalization (i18n)

### 1. Setup với next-intl

```typescript
// messages/en.json
{
  "tasks": {
    "title": "Tasks",
    "create": "Create Task", 
    "delete": "Delete Task",
    "status": {
      "pending": "Pending",
      "completed": "Completed"
    }
  }
}

// components/TaskCard.tsx
import { useTranslations } from 'next-intl';

export function TaskCard({ task }: TaskCardProps) {
  const t = useTranslations('tasks');
  
  return (
    <div>
      <h3>{task.title}</h3>
      <span>{t(`status.${task.status}`)}</span>
    </div>
  );
}
```

## 🚀 Deployment

### 1. Environment Variables

```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/zen-todo
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# .env.production
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=production-secret
```

### 2. Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['your-image-domain.com'],
  },
  // Compression và optimization
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
```

## 📚 Best Practices Summary

1. **Simplicity**: Giữ mọi thứ đơn giản và dễ hiểu
2. **Type Safety**: Sử dụng TypeScript nghiêm ngặt
3. **Performance**: Tối ưu database queries và client-side rendering
4. **Security**: Luôn validate input và kiểm tra authorization
5. **Testing**: Viết tests cho critical paths
6. **Documentation**: Comment code và update docs khi thêm features
7. **Error Handling**: Graceful error handling với user-friendly messages
8. **Accessibility**: Đảm bảo ứng dụng accessible cho mọi người dùng

## 🤝 Contributing

Khi contribute code mới:

1. **Fork & Branch**: Tạo branch mới từ main
2. **Follow Conventions**: Tuân theo code style và naming conventions
3. **Write Tests**: Thêm tests cho functionality mới
4. **Update Docs**: Cập nhật documentation nếu cần
5. **PR Review**: Tạo PR với description chi tiết

---

Tài liệu này sẽ được cập nhật liên tục khi có thêm patterns và best practices mới. Hãy tham khảo và follow để đảm bảo code quality và consistency. 