import { authService } from '../../auth/services/authService';

export const profileApi = {
  getProfile: async () => {
    return await authService.getProfile();
  },

  updateProfile: async (data: { full_name?: string; phone?: string; email?: string }) => {
    console.log("=== FRONTEND UPDATE PROFILE ===");
    console.log("Data being sent:", JSON.stringify(data));
    const response = await authService.updateProfile(data);
    console.log("Response received:", response);
    return response;
  },
};