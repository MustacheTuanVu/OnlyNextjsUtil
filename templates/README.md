# Templates

Thư mục này chứa các template mẫu để giúp developers nhanh chóng tạo ra các chức năng mới theo chuẩn của dự án OnlyNextjs Util.

## 📁 Các Template Có Sẵn

### 1. `model-template.ts`
Template cho MongoDB model với Mongoose:
- Interface TypeScript đầy đủ
- Schema validation và indexing
- Virtual fields và methods
- Pre/post hooks
- Best practices cho security và performance

**Cách sử dụng:**
1. Copy file và đổi tên thành `models/YourEntity.ts`
2. Thay thế `EntityName` bằng tên entity của bạn
3. Customize các fields theo business logic
4. Update interface và validation rules

### 2. `action-template.ts`
Template cho Server Actions:
- CRUD operations đầy đủ
- Authentication và authorization
- Input validation với Zod
- Error handling
- Cache revalidation
- TypeScript safety

**Cách sử dụng:**
1. Copy file và đổi tên thành `actions/yourEntity.ts`
2. Thay thế `EntityName` và `entity` references
3. Update validation schemas
4. Customize business logic

### 3. `component-template.tsx`
Template cho React components:
- Card component với actions
- Grid layout
- Form component với validation
- Loading states
- Error handling
- Responsive design

**Cách sử dụng:**
1. Copy file và đổi tên thành `components/YourEntityCard.tsx`
2. Thay thế `Entity` references
3. Customize UI và styling
4. Update TypeScript interfaces

### 4. `page-template.tsx`
Template cho Next.js pages:
- Server components pattern
- Suspense boundaries
- Loading states
- Error handling
- Statistics display
- Search và filtering

**Cách sử dụng:**
1. Copy file và đổi tên thành `app/dashboard/entities/page.tsx`
2. Update imports và references
3. Customize layout và features
4. Add metadata

## 🚀 Quick Start

Để tạo một entity mới (ví dụ: Task):

1. **Create Model:**
   ```bash
   cp templates/model-template.ts models/Task.ts
   # Sửa EntityName -> Task, IEntityName -> ITask
   ```

2. **Create Actions:**
   ```bash
   cp templates/action-template.ts actions/task.ts
   # Sửa EntityName -> Task, entity -> task
   ```

3. **Create Components:**
   ```bash
   cp templates/component-template.tsx components/TaskCard.tsx
   # Sửa Entity -> Task
   ```

4. **Create Page:**
   ```bash
   mkdir -p app/dashboard/tasks
   cp templates/page-template.tsx app/dashboard/tasks/page.tsx
   # Sửa entities -> tasks, Entity -> Task
   ```

5. **Update Sidebar Navigation:**
   Thêm link mới vào `components/Sidebar.tsx`

## 🎯 Customization Tips

### Models
- Luôn include `userId` field cho multi-tenant security
- Thêm indexes cho performance
- Sử dụng enum cho status fields
- Validate input lengths

### Actions
- Luôn check authentication
- Validate ownership của resources
- Sử dụng transactions cho complex operations
- Include proper error messages

### Components
- Follow Zen design principles
- Sử dụng consistent spacing và colors
- Include loading và error states
- Make responsive với Tailwind

### Pages
- Sử dụng Suspense cho better UX
- Include proper metadata
- Handle authentication
- Add breadcrumbs nếu cần

## 🔧 Advanced Patterns

### Với Real-time Updates
```typescript
// Sử dụng với Socket.io hoặc Server-Sent Events
const [entities, setEntities] = useState(initialEntities);

useEffect(() => {
  const eventSource = new EventSource('/api/entities/stream');
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setEntities(prev => updateEntities(prev, data));
  };
  return () => eventSource.close();
}, []);
```

### Với Advanced Filtering
```typescript
// Hook cho complex filtering
export function useEntityFilters() {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: null,
  });
  
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      // Filter logic
    });
  }, [entities, filters]);
  
  return { filters, setFilters, filteredEntities };
}
```

### Với Optimistic Updates
```typescript
// Optimistic updates cho better UX
const { mutate } = useMutation({
  mutationFn: updateEntity,
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['entities']);
    const previousEntities = queryClient.getQueryData(['entities']);
    queryClient.setQueryData(['entities'], old => 
      old.map(entity => 
        entity.id === newData.id ? { ...entity, ...newData } : entity
      )
    );
    return { previousEntities };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['entities'], context.previousEntities);
  },
});
```

## 📝 Notes

- Tất cả templates đều follow conventions của dự án
- TypeScript types được define đầy đủ
- Security best practices được implement
- Performance optimizations included
- Responsive design với Tailwind CSS
- Error handling và loading states

Hãy đọc `DEVELOPER_GUIDE.md` để hiểu chi tiết hơn về architecture và best practices. 