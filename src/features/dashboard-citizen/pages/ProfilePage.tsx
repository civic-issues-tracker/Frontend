import React, { useEffect, useState } from 'react';
import { CircleUser, Lock, Mail, Phone, User, Edit3, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { profileApi } from '../services/profileApi';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user: contextUser, setUser } = useAuth();
  type FormDataType = {
    full_name: string;
    email: string;
    phone: string;
    current_password: string;
    new_password: string;
    confirm_password: string;
  };
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifyLink, setVerifyLink] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    full_name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getProfile();
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || ''
          , current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
    setSaving(true);
    try {
      if ((formData.new_password || formData.confirm_password) && !formData.current_password) {
        toast.error(t('profilePage.messages.currentPasswordRequired') || 'Current password is required to change password.');
        setSaving(false);
        return;
      }

      if (formData.new_password && formData.new_password !== formData.confirm_password) {
        toast.error(t('profilePage.messages.passwordMismatch') || 'New passwords do not match.');
        setSaving(false);
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
        setSaving(false);
        return;
      }
      const response = await profileApi.updateProfile(updateData as any);
      toast.success(t('profilePage.messages.updateSuccess'));
      if (response?.updates?.email?.verify_link) {
        setVerifyLink(response.updates.email.verify_link);
      } else {
        setVerifyLink(null);
      }
      
      // Fetch fresh data from database
      const updatedProfile = await profileApi.getProfile();
      setProfile(updatedProfile);
      setFormData({
        full_name: updatedProfile.full_name || '',
        email: updatedProfile.email || '',
        phone: updatedProfile.phone || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      // Update AuthContext with new user data so it persists across the app
      if (setUser && contextUser) {
        const newUserData = { ...contextUser, ...updatedProfile };
        setUser(newUserData);
        sessionStorage.setItem('user', JSON.stringify(newUserData));
      }
      
      setIsEditing(false);
    } catch (error: any) {
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
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as unknown as FormDataType));
  };

  return (
    <CitizenDashboardLayout>
      <div className="min-h-screen bg-[#FDFBF9] font-sans flex flex-col pb-12">

        {/* HEADER HERO BANNER (COMPACTED HEIGHT) */}
        <div className="relative bg-gradient-to-r from-[#EAE0D5] to-[#C6AC8F] h-16 md:h-24 rounded-b-[16px] md:rounded-b-[24px] shadow-sm px-6 md:px-12 flex items-end">
          
          {/* PROFILE CARD INTEGRATION */}
          <div className="absolute left-6 md:left-12 -bottom-10 flex items-end gap-3 md:gap-4 z-10">
            <div className="bg-white rounded-xl p-1 shadow-md border border-amber-100/30">
              <div className="bg-[#FAF7F2] rounded-lg p-0.5">
                <CircleUser 
                  className="text-[#3D2B1F] w-16 h-16 md:w-20 md:h-20" 
                  strokeWidth={0.75} 
                />
              </div>
            </div>

            <div className="mb-1">
              <h1 className="text-lg md:text-2xl font-bold tracking-tight text-[#26150D]">
                {t('profilePage.title')}
              </h1>
              <p className="hidden sm:block text-xs text-[#5C4D43] font-medium">
                {t('profilePage.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN BODY CONTENT CONTAINER (ADJUSTED TOP MARGIN FOR COMPACT HEADER) */}
        <div className="flex-1 mt-14 md:mt-16 px-4 md:px-12 max-w-5xl w-full mx-auto">
          <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-2xl p-6 md:p-10">
            
            <div className="border-b border-gray-100 pb-5 mb-8">
              <h2 className="text-base font-semibold text-[#3D2B1F]">{t('profilePage.sectionTitle')}</h2>
              <p className="text-xs text-gray-500 mt-1">{t('profilePage.sectionDescription')}</p>
            </div>

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

              {/* Phone Input Group (Permanently Locked) */}
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

              {/* DYNAMIC ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                {!isEditing ? (
                  <button 
                    type="button" 
                    onClick={handleEdit}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#26150D] text-white font-medium text-sm hover:bg-[#3D2B1F] shadow-sm hover:shadow active:scale-[0.98] transition flex items-center justify-center gap-2"
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
          </div>
        </div>

        {/* LOADING ANIMATION SKELETON OVERLAY */}
        {loading && (
          <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50 transition-all">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#26150D] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <h3 className="font-semibold text-[#3D2B1F] text-base">{t('profilePage.loading.title')}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{t('profilePage.loading.subtitle')}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </CitizenDashboardLayout>
  );
};

export default ProfilePage;