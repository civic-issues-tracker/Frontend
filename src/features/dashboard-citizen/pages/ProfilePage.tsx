import React, { useEffect, useState, useContext } from 'react';
import { CircleUser } from 'lucide-react';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { profileApi } from '../services/profileApi';
import AuthContext from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user: contextUser, setUser } = useContext(AuthContext) || {};
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
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
      phone: profile?.phone || ''
    });
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await profileApi.updateProfile(formData);
      toast.success('Profile updated successfully!');
      
      // Fetch fresh data from database
      const updatedProfile = await profileApi.getProfile();
      setProfile(updatedProfile);
      setFormData({
        full_name: updatedProfile.full_name || '',
        email: updatedProfile.email || '',
        phone: updatedProfile.phone || ''
      });
      
      // Update AuthContext with new user data so it persists across the app
      if (setUser && contextUser) {
        const newUserData = { ...contextUser, ...updatedProfile };
        setUser(newUserData);
        sessionStorage.setItem('user', JSON.stringify(newUserData));
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <CitizenDashboardLayout>
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

        {/* HEADER */}
        <div className="relative bg-[#E1D4C6] h-24 md:h-36 rounded-b-[40px] md:rounded-b-[80px] shadow-sm px-4 md:px-10 flex items-end">
          
          {/* PROFILE HEADER LEFT */}
          <div className="absolute left-4 md:left-10 -bottom-14 md:-bottom-16 flex items-center gap-4">

            <div className="bg-white rounded-full p-1 shadow-sm">
              <CircleUser 
                className="text-[#3D2B1F] w-20 h-20 md:w-28 md:h-28" 
                strokeWidth={1} 
              />
            </div>

            <div>
              <h1 className="text-lg md:text-2xl font-semibold text-[#3D2B1F]">
                My Profile
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                View your personal information
              </p>
            </div>

          </div>
        </div>

        {/* FULL WIDTH CONTENT (NO CENTER CARD) */}
        <div className="flex-1 mt-20 md:mt-28 px-4 md:px-10">

          <div className="w-full bg-white shadow-sm border border-gray-100 rounded-xl p-6 md:p-10">

            <form className="flex flex-col gap-6 md:gap-8">

              {/* Full Name */}
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="md:w-48 text-sm text-gray-600">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  value={formData.full_name} 
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="md:w-48 text-sm text-gray-600">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="md:w-48 text-sm text-gray-600">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone} 
                  readOnly
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none bg-gray-50"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-5 pt-6">
                {!isEditing ? (
                  <button 
                    type="button" 
                    onClick={handleEdit}
                    className="w-full md:w-auto px-6 py-2 rounded-lg bg-[#26150D] text-white hover:bg-black transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button 
                      type="button" 
                      onClick={handleCancel}
                      className="w-full md:w-auto px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleUpdate}
                      className="w-full md:w-auto px-6 py-2 rounded-lg bg-[#26150D] text-white hover:bg-black transition"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Update'}
                    </button>
                  </>
                )}
              </div>

            </form>

          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="px-6 py-3 bg-white rounded-lg shadow text-[#3D2B1F] font-semibold">
              Loading...
            </div>
          </div>
        )}

      </div>
    </CitizenDashboardLayout>
  );
};

export default ProfilePage;