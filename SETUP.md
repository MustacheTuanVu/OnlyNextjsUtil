# 🚀 OnlyNextjs Util - Hướng dẫn Setup và Sử dụng

## 📋 Tổng quan

Ứng dụng quản lý user hiện đại được xây dựng với:
- ✅ **Next.js 15** với App Router
- ✅ **TypeScript** cho type safety
- ✅ **NextAuth** cho authentication
- ✅ **MongoDB** với Mongoose
- ✅ **Tailwind CSS** cho styling
- ✅ **Server Actions** thay vì API routes
- ✅ **Responsive Design** cho mobile & desktop

## 🛠️ Cài đặt nhanh

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
Cập nhật file `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/onlynextjs-util
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NODE_ENV=development
```

### 3. Chạy ứng dụng
```bash
# Development
npm run dev

# Seed database (optional)
npm run seed

# Health check
npm run health-check
```

## 🎯 Tính năng chính

### 🔐 Authentication
- Đăng ký tài khoản mới
- Đăng nhập với email/password
- Session management với NextAuth
- Protected routes với middleware

### 🏠 Dashboard
- Thông tin chào mừng user
- Giao diện đơn giản, clean
- Navigation đến My Profile

### 👤 My Profile
- Xem thông tin cá nhân (tên, email, ngày tạo tài khoản)
- Chỉnh sửa tên và email
- Đổi mật khẩu an toàn
- Form validation và error handling
- Toast notifications

### 🎨 UI/UX
- Responsive sidebar
- Toast notifications
- Loading states
- Form validation
- Smooth animations

## 📱 Responsive Design

### Desktop (1024px+)
- Sidebar cố định bên trái
- Layout 2 cột
- Hover effects

### Tablet (768px - 1023px)
- Sidebar có thể thu gọn
- Layout responsive

### Mobile (< 768px)
- Sidebar overlay
- Stack layout
- Touch-friendly controls
- Mobile menu

## 🗂️ Cấu trúc thư mục chi tiết

```
OnlyNextjsUtil/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 api/auth/           # NextAuth configuration
│   ├── 📁 dashboard/          # Protected dashboard pages
│   │   ├── 📁 profile/       # User profile management
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   └── page.tsx          # Dashboard home
│   ├── 📁 login/             # Login page
│   ├── 📁 register/          # Register page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── providers.tsx         # React providers
│
├── 📁 actions/               # Server Actions
│   ├── auth.ts              # Authentication actions
│   └── profile.ts           # Profile management actions
│
├── 📁 components/           # Reusable components
│   ├── ErrorBoundary.tsx   # Error handling
│   ├── Loading.tsx          # Loading states
│   ├── Modal.tsx            # Modal dialogs
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── Toast.tsx            # Notifications
│
├── 📁 lib/                  # Utilities & config
│   ├── auth.ts              # NextAuth configuration
│   └── mongodb.ts           # Database connection
│
├── 📁 models/               # MongoDB models
│   └── User.ts              # User schema
│
├── 📁 utils/                # Helper functions
│   ├── constants.ts         # App constants
│   ├── string.ts            # String utilities
│   └── validation.ts        # Validation helpers
│
├── 📁 types/                # TypeScript definitions
│   └── next-auth.d.ts       # NextAuth types
│
├── 📁 scripts/              # Database scripts
│   ├── seed.js              # Sample data seeding
│   ├── health-check.js      # System health check
│   └── test-encoding.js     # URL encoding tests
│
└── 📄 Configuration files
    ├── middleware.ts        # Route protection
    ├── next.config.js       # Next.js config
    ├── tailwind.config.js   # Tailwind config
    ├── tsconfig.json        # TypeScript config
    └── package.json         # Dependencies
```

## 🔄 Server Actions

Ứng dụng sử dụng **Server Actions** của Next.js 15 thay vì API routes:

### Auth Actions (`actions/auth.ts`)
```typescript
registerUser(formData: FormData) // Đăng ký user mới
```

### Profile Actions (`actions/profile.ts`)
```typescript
getUserProfile()                      // Lấy thông tin profile
updateUserProfile(formData: FormData) // Cập nhật tên, email
updatePassword(formData: FormData)    // Đổi mật khẩu
```

## 🎨 Components

### 🔄 Loading Components
```typescript
<LoadingSpinner />      // Spinner icon
<LoadingPage />         // Full page loading
<LoadingCard />         // Skeleton loading
<LoadingButton />       // Button with loading state
```

### 📢 Toast Notifications
```typescript
const { addToast } = useToast();

addToast({
  type: 'success',
  title: 'Thành công',
  message: 'Thao tác đã hoàn thành'
});
```

### 📱 Modal Dialogs
```typescript
<Modal isOpen={true} onClose={handleClose}>
  Content here
</Modal>

<ConfirmModal 
  isOpen={true}
  onConfirm={handleDelete}
  title=\"Xác nhận\"
  message=\"Bạn có chắc chắn?\"
/>
```

### 🛡️ Error Boundary
```typescript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string,           // Tên người dùng
  email: string,          // Email (unique)
  password: string,       // Mật khẩu đã hash
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- ✅ Password hashing với bcryptjs
- ✅ JWT session management
- ✅ CSRF protection với NextAuth
- ✅ Input sanitization và validation
- ✅ Protected routes với middleware
- ✅ Environment variables
- ✅ URL encoding cho international characters

## 📚 Scripts hữu ích

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Database seeding (3 sample users)
npm run seed

# System health check
npm run health-check

# Test URL encoding
npm run test-encoding

# Code linting
npm run lint
```

## 👥 Sample Accounts

Sau khi chạy `npm run seed`:

```
Email: admin@example.com
Password: 123456

Email: user@example.com  
Password: 123456

Email: demo@example.com
Password: 123456
```

## 🎯 Testing Guide

### 1. Authentication Testing
```bash
# 1. Start app
npm run dev

# 2. Test registration
# - Go to /register
# - Register with Vietnamese name: \"Nguyễn Văn A\"
# - Should redirect to /login with success message

# 3. Test login
# - Use sample account or newly registered account
# - Should redirect to /dashboard
```

### 2. Profile Management Testing
```bash
# 1. Login to dashboard
# 2. Click \"My Profile\" in sidebar
# 3. Test view profile information
# 4. Test edit name and email
# 5. Test password change functionality
# 6. Verify form validation
# 7. Check toast notifications
```

### 3. Responsive Testing
```bash
# Test different screen sizes:
# - Desktop (1024px+): Fixed sidebar
# - Tablet (768px-1023px): Collapsible sidebar  
# - Mobile (<768px): Overlay sidebar
```

### 4. Automated Testing
```bash
# Health check
npm run health-check

# URL encoding test
npm run test-encoding
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Connect với Vercel
3. Set environment variables
4. Deploy

### Environment Variables cho Production
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret-key
NODE_ENV=production
```

## 🔧 Customization

### Thêm tính năng mới
1. Tạo model trong `models/` (nếu cần)
2. Tạo actions trong `actions/`
3. Tạo components trong `components/`
4. Tạo pages trong `app/dashboard/`
5. Update sidebar navigation

### Thay đổi theme
- Cập nhật `tailwind.config.js`
- Sửa `app/globals.css`
- Modify color constants trong `utils/constants.ts`

### Thêm authentication provider (Google, GitHub, etc)
- Cập nhật `lib/auth.ts`
- Thêm provider configuration
- Update UI login/register

### Thêm field vào User model
```typescript
// 1. Update User model in models/User.ts
// 2. Update profile actions in actions/profile.ts  
// 3. Update profile form in app/dashboard/profile/page.tsx
// 4. Run migration if needed
```

## 🐛 Troubleshooting

### MongoDB connection issues
```bash
# Check MongoDB service
mongod --version

# Test connection
mongo mongodb://localhost:27017/onlynextjs-util

# Check connection string in .env.local
echo $MONGODB_URI
```

### NextAuth issues
```bash
# Clear browser data
# Check environment variables
# Verify NEXTAUTH_SECRET is set
# Check server logs for errors
```

### URL Encoding issues
```bash
# Test encoding functions
npm run test-encoding

# Check Vietnamese characters in forms
# Verify redirect URLs encode properly
```

### Build issues
```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run build
npm run build
```

### Profile update issues
```bash
# Check user is logged in
# Verify MongoDB connection
# Check server actions logs
# Test with sample accounts
```

## 💡 Best Practices

### Development
- Always run `npm run health-check` after setup
- Use `npm run test-encoding` before deployment
- Test with Vietnamese characters in forms
- Verify responsive design on different devices

### Security
- Never commit `.env.local` to git
- Use strong `NEXTAUTH_SECRET` in production
- Validate all user inputs
- Test password change functionality thoroughly

### Database
- Run `npm run seed` for development data
- Backup database before major changes
- Use MongoDB indexes for performance
- Monitor database connections

## 📞 Support

Nếu gặp vấn đề:

1. **First Steps:**
   - Run `npm run health-check`
   - Check console logs (browser + server)
   - Verify environment variables

2. **Common Issues:**
   - MongoDB connection → Check `MONGODB_URI`
   - NextAuth issues → Check `NEXTAUTH_SECRET`
   - URL encoding → Run `npm run test-encoding`
   - Profile updates → Check user session

3. **Documentation:**
   - Check `docs/TROUBLESHOOTING.md`
   - Review `CHANGELOG.md` for recent changes
   - See `UPDATE_SUMMARY.md` for latest features

4. **Get Help:**
   - Create GitHub issue with details
   - Include error logs and environment info

---

**Happy Coding! 🎉**

Ứng dụng đã sẵn sàng với focus vào user authentication và profile management!
