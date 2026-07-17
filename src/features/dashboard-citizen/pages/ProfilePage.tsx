import React, { useState, useEffect } from 'react';
import { CircleUser, Lock, Mail, Phone, User, Edit3, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { profileApi } from '../services/profileApi';
import { useAuth } from '../../../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user: contextUser, setUser } = useAuth();
  const queryClient = useQueryClient();

  type FormDataType = {
    full_name: string;
    email: string;
    phone: string;
    current_password: string;
    new_password: string;
    confirm_password: string;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [verifyLink, setVerifyLink] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    full_name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // TanStack Query for loading profile data smoothly
  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ['userProfileData'],
    queryFn: async () => {
      return await profileApi.getProfile();
    },
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,   
  });

  // Sync form state when query resolves (Best practice: avoids blocking render or buggy queryFn side-effects)
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      }));
    }
  }, [profile]);

  // TanStack Mutation for managing saving state changes smoothly
  const { mutate: updateProfileMutation, isPending: saving } = useMutation({
    mutationFn: async (updateData: Partial<FormDataType>) => {
      return await profileApi.updateProfile(updateData as any);
    },
    onSuccess: async (response) => {
      toast.success(t('profilePage.messages.updateSuccess'));
      if (response?.updates?.email?.verify_link) {
        setVerifyLink(response.updates.email.verify_link);
      } else {
        setVerifyLink(null);
      }

      // Invalidate cache timeline triggers to force absolute sync updates
      await queryClient.invalidateQueries({ queryKey: ['userProfileData'] });
      const updatedProfile = queryClient.getQueryData<any>(['userProfileData']) || await profileApi.getProfile();

      setFormData({
        full_name: updatedProfile.full_name || '',
        email: updatedProfile.email || '',
        phone: updatedProfile.phone || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });

      if (setUser && contextUser) {
        const newUserData = { ...contextUser, ...updatedProfile };
        setUser(newUserData);
        sessionStorage.setItem('user', JSON.stringify(newUserData));
      }

      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
      const data = error?.response?.data;
      let message = t('profilePage.messages.updateError');

      if (typeof data === 'string') {
        message = data;
      } else if (data && typeof data === 'object') {
        message = data.detail || data.error || data.message || (data.new_password || data.current_password || data.email) || message;
      } else if (error?.message) {
        message = error.message;
      }
      toast.error(message || t('profilePage.messages.updateError'));
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setVerifyLink(null);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if ((formData.new_password || formData.confirm_password) && !formData.current_password) {
      toast.error(t('profilePage.messages.currentPasswordRequired') || 'Current password is required to change password.');
      return;
    }

    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      toast.error(t('profilePage.messages.passwordMismatch') || 'New passwords do not match.');
      return;
    }

    const updateData: Partial<FormDataType> = {};
    if (formData.full_name !== profile?.full_name) {
      updateData.full_name = formData.full_name;
    }
    if (formData.email !== profile?.email) {
      updateData.email = formData.email;
    }
    if (formData.new_password) {
      updateData.current_password = formData.current_password;
      updateData.new_password = formData.new_password;
      updateData.confirm_password = formData.confirm_password;
    }

    if (Object.keys(updateData).length === 0) {
      toast.error(t('profilePage.messages.noChanges') || 'No changes to save.');
      return;
    }

    updateProfileMutation(updateData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as unknown as FormDataType));
  };

  return (
    <CitizenDashboardLayout>
      <div className="min-h-screen bg-primary font-sans flex flex-col pb-12 -mt-4 md:-mt-8">
        
        {/* HEADER HERO BANNER */}
        <div className="relative bg-secondary h-12 md:h-16 rounded-b-2xl md:rounded-b-3xl shadow-sm px-6 md:px-12 flex items-end">
          
          {/* PROFILE CARD INTEGRATION */}
          <div className="absolute left-6 md:left-12 -bottom-10 flex items-end gap-3 md:gap-4 z-10">
            <div className="bg-white rounded-xl p-1 shadow-md border border-amber-100/30">
              <div className="bg-[#FAF7F2] rounded-lg p-0.5">
                <CircleUser 
                  className="text-secondary w-16 h-16 md:w-20 md:h-20" 
                  strokeWidth={0.75} 
                />
              </div>
            </div>

            <div className="-mt-2 md:-mt-4 mb-1 p">
              <h1 className="text-lg md:text-2xl font-bold tracking-tight text-secondary">
                {t('profilePage.title')}
              </h1>
              <p className="hidden sm:block text-xs text-[#5C4D43] font-medium">
                {t('profilePage.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN BODY CONTENT CONTAINER */}
        <div className="flex-1 mt-14 md:mt-16 px-4 md:px-12 max-w-5xl w-full mx-auto">
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-2xl p-6 md:p-10">
            
            <div className="border-b border-gray-100 pb-5 mb-8">
              <h2 className="text-base font-semibold text-[#3D2B1F]">{t('profilePage.sectionTitle')}</h2>
              <p className="text-xs text-gray-500 mt-1">{t('profilePage.sectionDescription')}</p>
            </div>

            {loading ? (
              /* DYNAMIC LOADING INFRASTRUCTURE SKELETON REPLACEMENT */
              <div className="flex flex-col gap-6 animate-pulse">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="md:w-48 h-5 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 h-10 bg-gray-100 rounded-xl"></div>
                  </div>
                ))}
                <div className="flex justify-end pt-6 border-t border-gray-100 mt-4">
                  <div className="w-32 h-10 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

                {/* Full Name Input Group */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-48 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    {t('profilePage.labels.fullName')}
                  </label>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      name="full_name"
                      value={formData.full_name} 
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder={t('profilePage.placeholders.fullName')}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none
                        ${isEditing 
                          ? 'border-[#C6AC8F] bg-white focus:ring-4 focus:ring-[#EAE0D5]/40 text-gray-900 shadow-sm' 
                          : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        }`}
                    />
                  </div>
                </div>

                {/* Email Input Group */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-48 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {t('profilePage.labels.email')}
                  </label>
                  <div className="flex-1 relative">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email} 
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder={t('profilePage.placeholders.email')}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none
                        ${isEditing 
                          ? 'border-[#C6AC8F] bg-white focus:ring-4 focus:ring-[#EAE0D5]/40 text-gray-900 shadow-sm' 
                          : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        }`}
                    />
                    {isEditing && (
                      <p className="mt-2 text-xs text-amber-700">
                        {t('profilePage.messages.emailUpdateNote')}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <label className="md:w-48 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock size={16} className="text-gray-400" />
                        {t('profilePage.labels.currentPassword') || 'Current Password'}
                      </label>
                      <div className="flex-1 relative">
                        <input
                          type="password"
                          name="current_password"
                          value={formData.current_password}
                          onChange={handleChange}
                          placeholder={t('profilePage.placeholders.currentPassword') || 'Enter current password'}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:border-[#C6AC8F] focus:ring-4 focus:ring-[#EAE0D5]/40 outline-none shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <label className="md:w-48 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock size={16} className="text-gray-400" />
                        {t('profilePage.labels.newPassword') || 'New Password'}
                      </label>
                      <div className="flex-1 relative">
                        <input
                          type="password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleChange}
                          placeholder={t('profilePage.placeholders.newPassword') || 'Enter new password'}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:border-[#C6AC8F] focus:ring-4 focus:ring-[#EAE0D5]/40 outline-none shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <label className="md:w-48 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock size={16} className="text-gray-400" />
                        {t('profilePage.labels.confirmPassword') || 'Confirm Password'}
                      </label>
                      <div className="flex-1 relative">
                        <input
                          type="password"
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder={t('profilePage.placeholders.confirmPassword') || 'Confirm new password'}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white text-gray-900 focus:border-[#C6AC8F] focus:ring-4 focus:ring-[#EAE0D5]/40 outline-none shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone Input Group */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <label className="md:w-48 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {t('profilePage.labels.phone')}
                  </label>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone} 
                      readOnly={true}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" title={t('profilePage.phoneLockTitle')}>
                      <Lock size={14} />
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                  {!isEditing ? (
                    <button 
                      type="button" 
                      onClick={handleEdit}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-secondary text-white font-medium text-sm hover:bg-[#3D2B1F] shadow-sm hover:shadow active:scale-[0.98] transition flex items-center justify-center gap-2"
                    >
                      <Edit3 size={16} />
                      {t('profilePage.buttons.editProfile')}
                    </button>
                  ) : (
                    <>
                      <button 
                        type="button" 
                        onClick={handleCancel}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 active:scale-[0.98] transition flex items-center justify-center gap-2"
                        disabled={saving}
                      >
                        <X size={16} />
                        {t('profilePage.buttons.cancel')}
                      </button>
                      <button 
                        type="button" 
                        onClick={handleUpdate}
                        className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-[#26150D] text-white font-medium text-sm hover:bg-black shadow-sm hover:shadow active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-85"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            {t('profilePage.buttons.saving')}
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            {t('profilePage.buttons.saveUpdates')}
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>

                {verifyLink && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mt-4">
                    <p className="font-semibold">{t('profilePage.messages.emailVerifyLinkTitle') || 'Email verification link generated:'}</p>
                    <a href={verifyLink} className="break-all text-amber-800 underline" target="_blank" rel="noreferrer">
                      {verifyLink}
                    </a>
                  </div>
                )}

              </form>
            )}
          </div>
        </div>
      </div>
    </CitizenDashboardLayout>
  );
};

export default ProfilePage;