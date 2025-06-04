# 🚀 Quick Start - Tích Hợp Chức Năng Mới

Hướng dẫn nhanh để tích hợp chức năng mới vào OnlyNextjs Util trong 5 phút.

## 📋 Prerequisite

- Node.js đã được cài đặt
- MongoDB đang chạy
- Dự án đã được setup theo `SETUP.md`

## ⚡ Cách 1: Sử dụng Entity Generator (Khuyên dùng)

### Bước 1: Chạy Generator
```bash
npm run create-entity
# hoặc
npm run generate
```

### Bước 2: Nhập tên entity
```
Enter entity name (e.g., Task, Project, Habit): Task
```

### Bước 3: Confirm
```
This will create files for entity "Task". Continue? (y/N): y
```

### Bước 4: Hoàn tất
Script sẽ tự động tạo:
- `models/Task.ts` - MongoDB model
- `actions/task.ts` - Server actions
- `components/TaskCard.tsx` - UI components
- `app/dashboard/tasks/page.tsx` - Next.js page

### Bước 5: Manual Steps
1. Thêm navigation vào `components/Sidebar.tsx`:
```typescript
{
  name: 'Tasks',
  href: '/dashboard/tasks',
  icon: CheckSquare, // Import từ lucide-react
},
```

2. Customize model schema theo business logic
3. Update validation rules
4. Style components

## ⚡ Cách 2: Manual Copy Templates

### Bước 1: Copy Templates
```bash
# Model
cp templates/model-template.ts models/Task.ts

# Actions  
cp templates/action-template.ts actions/task.ts

# Components
cp templates/component-template.tsx components/TaskCard.tsx

# Page
mkdir -p app/dashboard/tasks
cp templates/page-template.tsx app/dashboard/tasks/page.tsx
```

### Bước 2: Find & Replace
Trong tất cả files vừa copy:
- `EntityName` → `Task`
- `IEntityName` → `ITask`
- `entity` → `task`
- `entities` → `tasks`
- `Entity` → `Task`

### Bước 3: Fix Imports
Cập nhật tất cả import statements để match với tên files mới.

## 🎯 Ví Dụ Thực Tế: Tạo Task Management

### 1. Generate Files
```bash
npm run create-entity
# Nhập: Task
```

### 2. Customize Model
```typescript
// models/Task.ts
export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Add Navigation
```typescript
// components/Sidebar.tsx
import { CheckSquare } from 'lucide-react';

const navigation = [
  // ... existing items
  {
    name: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
];
```

### 4. Test
```bash
npm run dev
# Truy cập http://localhost:3000/dashboard/tasks
```

## 🛠️ Customization Tips

### Models
```typescript
// Thêm fields tùy chỉnh
const TaskSchema = new Schema({
  // ... existing fields
  tags: [{ type: String }],
  category: { 
    type: String, 
    enum: ['work', 'personal', 'shopping'] 
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
```

### Actions
```typescript
// Thêm custom actions
export async function getTasksByStatus(status: string) {
  const user = await getAuthenticatedUser();
  return await Task.find({ userId: user.id, status }).lean();
}
```

### Components
```typescript
// Thêm custom styling
const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};
```

### Pages
```typescript
// Thêm filtering
export default async function TasksPage({ searchParams }) {
  const status = searchParams.status || 'all';
  const tasks = status === 'all' 
    ? await getTasks() 
    : await getTasksByStatus(status);
    
  return (
    <div>
      <TaskFilterTabs />
      <TaskGrid tasks={tasks} />
    </div>
  );
}
```

## 🔧 Advanced Features

### Real-time Updates
```typescript
// Thêm vào component
useEffect(() => {
  const eventSource = new EventSource('/api/tasks/stream');
  eventSource.onmessage = (event) => {
    const updatedTask = JSON.parse(event.data);
    setTasks(prev => updateTaskInArray(prev, updatedTask));
  };
  return () => eventSource.close();
}, []);
```

### Search & Filter
```typescript
const [filters, setFilters] = useState({
  status: '',
  priority: '',
  search: ''
});

const filteredTasks = useMemo(() => {
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}, [tasks, filters]);
```

### Drag & Drop
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function TaskKanban({ tasks }) {
  const handleDragEnd = (event) => {
    // Update task status based on drop zone
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {['pending', 'in-progress', 'completed'].map(status => (
          <TaskColumn key={status} status={status} tasks={tasks.filter(t => t.status === status)} />
        ))}
      </div>
    </DndContext>
  );
}
```

## 📚 Resources

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Hướng dẫn chi tiết
- [templates/README.md](./templates/README.md) - Template documentation
- [SETUP.md](./SETUP.md) - Project setup
- [README.md](./README.md) - Project overview

## 🤝 Need Help?

1. Kiểm tra console logs để debug
2. Đọc error messages carefully
3. Follow TypeScript errors để fix imports
4. Tham khảo existing code patterns
5. Check MongoDB connection nếu có database errors

---

**Mẹo**: Luôn bắt đầu với generator, sau đó customize từ từ theo business requirements. Điều này đảm bảo code consistency và giảm bugs. 