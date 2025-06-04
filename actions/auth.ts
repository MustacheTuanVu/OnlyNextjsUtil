'use server';

import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import { createUrlWithParams } from '@/utils/string';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    throw new Error('Tất cả các trường đều bắt buộc');
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  try {
    await dbConnect();

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo user mới
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Có lỗi xảy ra khi đăng ký');
  }
  
  // Sử dụng utility function để tạo URL an toàn
  const redirectUrl = createUrlWithParams('/login', {
    message: 'Đăng ký thành công, vui lòng đăng nhập'
  });
  redirect(redirectUrl);
}
