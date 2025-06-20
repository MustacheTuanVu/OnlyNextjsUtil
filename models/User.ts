import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for Google auth
  googleId?: string; // Google provider account ID
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Not required for Google auth
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allows multiple null values
  },
}, {
  timestamps: true,
});

// Không cần tạo index thêm vì unique: true đã tự động tạo index

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
