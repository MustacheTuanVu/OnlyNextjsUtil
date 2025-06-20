# OnlyNextjs Util

Ứng dụng utility framework hiện đại được xây dựng với Next.js 15, NextAuth và MongoDB. Đăng nhập dễ dàng với Google OAuth và tương tác trực tiếp với database mà không cần API trung gian.

## 🚀 Công nghệ sử dụng

- **Next.js 15** - App Router, Server Components và Server Actions
- **TypeScript** - Type safety và developer experience tốt hơn
- **NextAuth** - Authentication và session management với Google OAuth
- **MongoDB** - NoSQL database với Mongoose ODM
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## ✨ Tính năng

- ✅ **Google OAuth Login** - Đăng nhập nhanh chóng và an toàn với Google
- ✅ **Dashboard** hiển thị thông tin chào mừng
- ✅ **My Profile** - Quản lý thông tin cá nhân
- ✅ **Profile Management** - Chỉnh sửa tên, email
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

Tạo file `.env.local` và cập nhật các giá trị:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/your-database-name
# hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
# Lấy từ Google Cloud Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Environment
NODE_ENV=development
```

### 4. Cấu hình Google OAuth

#### Bước 1: Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project đã có
3. Kích hoạt Google+ API (hoặc Google OAuth2 API)

#### Bước 2: Tạo OAuth 2.0 Credentials
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Web application**
4. Thêm **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (cho development)
   - `https://yourdomain.com/api/auth/callback/google` (cho production)

#### Bước 3: Cập nhật .env.local
Sao chép Client ID và Client Secret vào file `.env.local`

### 5. Cài đặt MongoDB

#### Option 1: MongoDB Local
- Tải và cài đặt [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Khởi động MongoDB service

#### Option 2: MongoDB Atlas (Cloud)
- Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/atlas)
- Tạo cluster mới
- Lấy connection string và cập nhật `MONGODB_URI`

### 6. Chạy ứng dụng

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
│   ├── login/             # Login page với Google OAuth
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # React providers
│
├── actions/              # Server Actions
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
│   ├── auth.ts           # NextAuth configuration với Google OAuth
│   └── mongodb.ts        # Database connection
│
├── models/              # MongoDB models
│   └── User.ts           # User schema (hỗ trợ Google OAuth)
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

1. **Google OAuth**: User click "Đăng nhập với Google" → Redirect đến Google → User authorize → Callback đến app
2. **User Creation**: Nếu user chưa tồn tại → Tự động tạo user mới với thông tin từ Google
3. **Session Management**: NextAuth quản lý session và tự động refresh
4. **Protected Routes**: Middleware kiểm tra session trước khi cho phép truy cập

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string;
  email: string; // unique
  password?: string; // optional (không dùng cho Google users)
  googleId?: string; // Google account ID
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 Server Actions

Ứng dụng sử dụng **Server Actions** của Next.js 15 để tương tác trực tiếp với MongoDB:

### Profile Actions (`actions/profile.ts`)
- `getUserProfile()` - Lấy thông tin profile user
- `updateUserProfile()` - Cập nhật thông tin user (tên, email)
- `updatePassword()` - Đổi mật khẩu (chỉ cho non-Google users)
- `isGoogleUser()` - Kiểm tra user có phải Google user không

## 🎨 Profile Management

### Tính năng My Profile:
- **Xem thông tin**: Hiển thị tên, email, ngày tạo tài khoản
- **Chỉnh sửa thông tin**: Cập nhật tên và email với validation
- **Google Users**: Không thể đổi mật khẩu (quản lý thông qua Google)
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

## 🔧 Troubleshooting

### Google OAuth Issues
- Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` đúng chưa
- Đảm bảo redirect URI đã được thêm vào Google Cloud Console
- Kiểm tra `NEXTAUTH_URL` phù hợp với environment (dev/prod)

### Database Issues
- Kiểm tra `MONGODB_URI` connection string
- Đảm bảo MongoDB service đang chạy (nếu dùng local)
- Kiểm tra network access cho MongoDB Atlas (nếu dùng cloud)

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
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2) - OAuth provider
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
