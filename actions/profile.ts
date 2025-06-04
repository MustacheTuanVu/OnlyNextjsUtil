'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Bạn phải đăng nhập để xem profile');
  }

  try {
    await dbConnect();
    
    const user = await User.findById(session.user.id)
      .select('-password') // Không trả về password
      .lean();

    if (!user) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }

    return {
      ...user,
      _id: user._id.toString(),
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Không thể lấy thông tin profile');
  }
}

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Bạn phải đăng nhập để cập nhật profile');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  if (!name || !email) {
    throw new Error('Tên và email là bắt buộc');
  }

  try {
    await dbConnect();
    
    // Kiểm tra email có bị trùng với user khác không
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: session.user.id } 
    });
    
    if (existingUser) {
      throw new Error('Email đã được sử dụng bởi người dùng khác');
    }

    // Cập nhật thông tin user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      throw new Error('Không tìm thấy người dùng');
    }

    revalidatePath('/dashboard/profile');
    
    return {
      ...updatedUser.toObject(),
      _id: updatedUser._id.toString(),
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Không thể cập nhật profile');
  }
}

export async function updatePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Bạn phải đăng nhập để đổi mật khẩu');
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error('Tất cả các trường đều bắt buộc');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('Mật khẩu mới và xác nhận mật khẩu không khớp');
  }

  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  try {
    await dbConnect();
    
    // Lấy user với password để verify
    const user = await User.findById(session.user.id);
    
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      throw new Error('Mật khẩu hiện tại không đúng');
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật mật khẩu
    await User.findByIdAndUpdate(session.user.id, {
      password: hashedNewPassword
    });

    revalidatePath('/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Không thể cập nhật mật khẩu');
  }
}
