import axios from 'axios';

const BASE_URL = 'https://yeabsiraamare.pythonanywhere.com/api/v1';

// Public Client (No token needed)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, 
});

// Private Client (Needs Access Token)
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true,
});


interface LoginCredentials {
  email?: string; 
  phone?: string;
  password: string;
}

interface RegisterData {
  phone: string;
  password: string;
  confirm_password: string;
  verification_method: 'sms' | 'email';
  full_name: string;
  email: string;
}

interface VerifyOTPPayload {
  temp_id: string;
  otp_code: string;
}

interface ResendOTPPayload {
  temp_id: string;
}

interface SystemAdminRegister {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

interface CreateOrgAdminPayload {
  email: string;
  full_name: string;
  phone: string;
  organization_name: string;
}

interface CompleteOrgAdminPayload {
  token: string; // OTP sent via email link
  password: string;
  confirm_password: string;
}


export const authService = {
  register: async (userData: RegisterData) => {
    const response = await publicApi.post('/auth/register/resident/', userData);
    return response.data;
  },

  verifyOTP: async (payload: VerifyOTPPayload) => {
    const response = await publicApi.post('/auth/verify-otp/', payload);
    return response.data;
  },

  resendOTP: async (payload: ResendOTPPayload) => {
    const response = await publicApi.post('/auth/resend-otp/', payload);
    return response.data;
  },


  login: async (credentials: LoginCredentials) => {
    const response = await publicApi.post('/auth/login/', credentials);
    return response.data;
  },

  logout: async () => {
    await privateApi.post('/auth/logout/');
  },

  refreshToken: async () => {
    const response = await publicApi.post('/auth/token/refresh/');
    return response.data;
  },

  // profile & user Data
  getProfile: async () => {
    const response = await privateApi.get('/auth/profile/');
    return response.data;
  },

  // Admin Management
  registerSystemAdmin: async (data: SystemAdminRegister) => {
    const response = await publicApi.post('/auth/register/system-admin/', data);
    return response.data;
  },

  createOrgAdmin: async (data: CreateOrgAdminPayload) => {
    //only system admin can call this
    const response = await privateApi.post('/auth/admin/create-org-admin/', data);
    return response.data;
  },

  completeOrgRegistration: async (data: CompleteOrgAdminPayload) => {
    const response = await publicApi.post('/auth/complete-registration/', data);
    return response.data;
  }
};