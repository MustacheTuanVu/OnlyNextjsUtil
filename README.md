# OnlyNextjs Util

Ứng dụng utility framework hiện đại được xây dựng với Next.js 15, NextAuth và MongoDB. Tương tác trực tiếp với database mà không cần API trung gian.

## 🚀 Công nghệ sử dụng

- **Next.js 15** - App Router, Server Components và Server Actions
- **TypeScript** - Type safety và developer experience tốt hơn
- **NextAuth** - Authentication và session management
- **MongoDB** - NoSQL database với Mongoose ODM
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## ✨ Tính năng

- ✅ **Đăng ký/Đăng nhập** với NextAuth
- ✅ **Dashboard** hiển thị thông tin chào mừng
- ✅ **My Profile** - Quản lý thông tin cá nhân
- ✅ **Profile Management** - Chỉnh sửa tên, email, đổi mật khẩu
- ✅ **Responsive Design** - Thân thiện trên cả desktop và mobile
- ✅ **Server Actions** - Tương tác MongoDB mà không cần API routes
- ✅ **Real-time Updates** - Cập nhật dữ liệu ngay lập tức

## 🛠️ Cài đặt

### 1. Clone repository

```bash
cd OnlyNextjsUtil
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Cấu hình environment variables

Sao chép file `.env.local` và cập nhật các giá trị:

```bash
cp .env.local .env.local
```

Cập nhật các giá trị trong `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/your-database-name
# hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Environment
NODE_ENV=development
```

### 4. Cài đặt MongoDB

#### Option 1: MongoDB Local
- Tải và cài đặt [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Khởi động MongoDB service

#### Option 2: MongoDB Atlas (Cloud)
- Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/atlas)
- Tạo cluster mới
- Lấy connection string và cập nhật `MONGODB_URI`

### 5. Chạy ứng dụng

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 📁 Cấu trúc thư mục

```
OnlyNextjsUtil/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (NextAuth)
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── profile/       # User profile management
│   │   ├── layout.tsx     # Dashboard layout with sidebar
│   │   └── page.tsx       # Dashboard home
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # React providers
│
├── actions/              # Server Actions
│   ├── auth.ts           # Authentication actions
│   └── profile.ts        # Profile management actions
│
├── components/          # Reusable components
│   ├── ErrorBoundary.tsx # Error handling
│   ├── Loading.tsx       # Loading states
│   ├── Modal.tsx         # Modal dialogs
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── Toast.tsx         # Notifications
│
├── lib/                 # Utilities & config
│   ├── auth.ts           # NextAuth configuration
│   └── mongodb.ts        # Database connection
│
├── models/              # MongoDB models
│   └── User.ts           # User schema
│
├── utils/               # Helper functions
│   ├── constants.ts      # App constants
│   ├── string.ts         # String utilities
│   └── validation.ts     # Validation helpers
│
├── types/               # TypeScript definitions
│   └── next-auth.d.ts    # NextAuth types
│
├── scripts/             # Utility scripts
│   ├── seed.js           # Sample data seeding
│   ├── health-check.js   # System health check
│   └── test-encoding.js  # URL encoding tests
│
└── 📄 Configuration files
    ├── middleware.ts     # Route protection
    ├── next.config.js    # Next.js config
    ├── tailwind.config.js # Tailwind config
    ├── tsconfig.json     # TypeScript config
    └── package.json      # Dependencies
```

## 🔐 Authentication Flow

1. **Đăng ký**: User tạo tài khoản mới → Mật khẩu được hash với bcryptjs → Lưu vào MongoDB
2. **Đăng nhập**: NextAuth xác thực credentials → Tạo JWT session → Redirect đến dashboard
3. **Session Management**: NextAuth quản lý session và tự động refresh
4. **Protected Routes**: Middleware kiểm tra session trước khi cho phép truy cập

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string;
  email: string; // unique
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 Server Actions

Ứng dụng sử dụng **Server Actions** của Next.js 15 để tương tác trực tiếp với MongoDB:

### Authentication Actions (`actions/auth.ts`)
- `registerUser()` - Đăng ký user mới

### Profile Actions (`actions/profile.ts`)
- `getUserProfile()` - Lấy thông tin profile user
- `updateUserProfile()` - Cập nhật thông tin user (tên, email)
- `updatePassword()` - Đổi mật khẩu với xác thực mật khẩu cũ

## 🎨 Profile Management

### Tính năng My Profile:
- **Xem thông tin**: Hiển thị tên, email, ngày tạo tài khoản
- **Chỉnh sửa thông tin**: Cập nhật tên và email với validation
- **Đổi mật khẩu**: Thay đổi mật khẩu an toàn với xác thực
- **Form Validation**: Client-side và server-side validation
- **Toast Notifications**: Thông báo thành công/lỗi
- **Loading States**: Hiển thị trạng thái loading khi xử lý

## 📱 Responsive Design

- **Desktop**: Sidebar cố định, layout rộng
- **Tablet**: Sidebar thu gọn, layout responsive
- **Mobile**: Sidebar overlay, touch-friendly controls

## 🚦 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Database utilities
npm run seed
npm run health-check
```

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Hướng dẫn setup chi tiết

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
