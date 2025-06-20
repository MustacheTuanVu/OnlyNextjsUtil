'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, updatePassword, isGoogleUser } from '@/actions/profile';
import { useToast } from '@/components/Toast';
import { LoadingButton } from '@/components/Loading';
import { User, Mail, Calendar, Edit, Lock, Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [isUserGoogleAccount, setIsUserGoogleAccount] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { addToast } = useToast();

  useEffect(() => {
    loadProfile();
    checkGoogleUser();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi tải dữ liệu',
        message: 'Không thể tải thông tin profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkGoogleUser = async () => {
    try {
      const isGoogle = await isGoogleUser();
      setIsUserGoogleAccount(isGoogle);
    } catch (error) {
      console.error('Error checking Google user:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);

      const updatedProfile = await updateUserProfile(formDataToSend);
      setProfile(updatedProfile);
      setEditMode(false);
      
      addToast({
        type: 'success',
        title: 'Cập nhật thành công',
        message: 'Thông tin profile đã được cập nhật'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi cập nhật',
        message: error instanceof Error ? error.message : 'Không thể cập nhật profile'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('currentPassword', passwordData.currentPassword);
      formDataToSend.append('newPassword', passwordData.newPassword);
      formDataToSend.append('confirmPassword', passwordData.confirmPassword);

      await updatePassword(formDataToSend);
      setChangePasswordMode(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      addToast({
        type: 'success',
        title: 'Đổi mật khẩu thành công',
        message: 'Mật khẩu của bạn đã được cập nhật'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi đổi mật khẩu',
        message: error instanceof Error ? error.message : 'Không thể đổi mật khẩu'
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {editMode ? (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <LoadingButton
                  type="submit"
                  loading={updating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu thay đổi
                </LoadingButton>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: profile?.name || '',
                      email: profile?.email || '',
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="text-lg font-medium text-gray-900">{profile?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium text-gray-900">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                  <p className="text-lg font-medium text-gray-900">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>

              {isUserGoogleAccount && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <p className="text-sm text-blue-800 font-medium">Tài khoản Google</p>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Bạn đang sử dụng tài khoản Google. Mật khẩu được quản lý bởi Google.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Change Password - Only show for non-Google users */}
      {!isUserGoogleAccount && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Đổi mật khẩu</h2>
              {!changePasswordMode && (
                <button
                  onClick={() => setChangePasswordMode(true)}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {changePasswordMode ? (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordFormChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordFormChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <LoadingButton
                    type="submit"
                    loading={changingPassword}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đổi mật khẩu
                  </LoadingButton>
                  <button
                    type="button"
                    onClick={() => {
                      setChangePasswordMode(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">
                Nhấp vào nút "Đổi mật khẩu" để cập nhật mật khẩu của bạn.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
