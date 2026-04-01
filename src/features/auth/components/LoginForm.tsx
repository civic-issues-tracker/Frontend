import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Input from '../../../../src/components/ui/Input';
import { useAuth } from '../../../hooks/useAuth'; 
import { authService } from '../../../features/auth/services/authService';
import Toast, {  type ToastType } from '../../../components/ui/Toast';

const loginSchema = z.object({
  identifier: z.string().min(1, "Phone or Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: ToastType }>({
      show: false,
      msg: '',
      type: 'info'
    });

  const { login } = useAuth();

  const showToast = (msg: string, type: ToastType) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (data: LoginData) => {
    setLoading(true);
    setServerError(null);
    
    // Check if the input is an email or a phone number
    const isEmail = data.identifier.includes('@');
    const payload = isEmail 
      ? { email: data.identifier, password: data.password }
      : { phone: data.identifier, password: data.password };

    try {
      const result = await authService.login(payload);

      if (result.access && result.user) {
        login({
          access: result.access,
          user: result.user
        });

        const role = result.user.role_name; 
        showToast("Login successful!", "success");

        if (role === 'system_admin') {
          navigate('/admin-dashboard');
        } else if (role === 'organization') {
          navigate('/organization-dashboard');
        } else {
          navigate('/report');
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 429) {
          showToast("Security: Too many attempts. Please wait.", "error");
        } else if (status === 404) {
          showToast("User not found.", "error");
        } else if (status === 401) {
          showToast("Invalid credentials. Please try again.", "error");
        } else {
          showToast(error.response?.data?.detail || "Authentication failed.", "error");
        }
      } else {
        showToast("Connection failed. Check your internet.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <motion.form 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      onSubmit={handleSubmit(onLoginSubmit)}
      className="space-y-8"
    >
      <div className="space-y-6">
        <Input 
          label="Phone or Email" 
          placeholder="Enter phone or email"
          {...register("identifier")} 
          error={errors.identifier?.message} 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••"
          {...register("password")} 
          error={errors.password?.message} 
        />
      </div>

      {serverError && (
        <div className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest bg-red-500/5 p-3 rounded">
          <AlertCircle size={14} />
          <span>{serverError}</span>
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full group flex items-center justify-between py-6 border-b border-secondary/10 hover:border-secondary transition-all disabled:opacity-50"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">
          {loading ? "Authenticating..." : "Access Account"}
        </span>
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />}
      </button>

      <button 
        type="button"
        onClick={() => navigate('/signup')}
        className="text-[9px] font-black uppercase tracking-[0.3em] text-secondary/40 hover:text-secondary transition-colors text-left"
      >
        New here? <span className="text-secondary border-b border-secondary/20 ml-1">Create Account</span>
      </button>
    </motion.form>
    <Toast 
      isVisible={toast.show} 
      message={toast.msg} 
      type={toast.type} 
      onClose={() => setToast(p => ({...p, show: false}))} 
    />
    </>
  );
};

export default LoginForm;