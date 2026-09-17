import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, CheckCircle2, Smartphone, Mail, ArrowLeftRight } from 'lucide-react';
import { authService } from '../../../features/auth/services/authService';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';

const createResetSchema = (flow: 'email' | 'sms') => 
  z.object({
    otp_code: flow === 'sms' 
      ? z.string().min(4, "OTP code is required") 
      : z.string().optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/.*[0-9].*/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage: React.FC = () => {
  const { token: urlToken } = useParams<{ token: string }>(); 
  const [searchParams] = useSearchParams();
  
  const tokenFromQuery = searchParams.get('token');
  const tempIdFromQuery = searchParams.get('temp_id');
  const phoneFromQuery = searchParams.get('phone');
  
  const activeToken = urlToken || tokenFromQuery;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize flow based on token availability
  const [flow, setFlow] = useState<'email' | 'sms'>(activeToken ? 'email' : 'sms');
  const { showToast } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createResetSchema(flow)),
  });

  const toggleFlow = () => {
    const nextFlow = flow === 'email' ? 'sms' : 'email';
    setFlow(nextFlow);
    reset();
  };

  const onResetSubmit = async (data: any) => {
    setLoading(true);
    try {
      let resetToken = activeToken;

      if (flow === 'sms') {
        if (!tempIdFromQuery || !data.otp_code) {
          showToast("Missing reset session or OTP code. Start forgot password again.", "error");
          setLoading(false);
          return;
        }

        // Step 1 for SMS: Verify OTP to get reset token
        const otpRes = await authService.verifyResetOTP({
          temp_id: tempIdFromQuery,
          otp_code: data.otp_code,
        });

        resetToken = otpRes?.token || otpRes?.reset_token;
      }

      if (!resetToken) {
        showToast("Missing reset token. Please restart the reset process.", "error");
        setLoading(false);
        return;
      }

      // Step 2: Call resetPasswordConfirm with token and passwords matching ResetPasswordSerializer
      await authService.resetPasswordConfirm({
        token: resetToken,
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      setSuccess(true);
      showToast("Password updated successfully!", "success");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      const serverMessage = err.response?.data?.error || err.response?.data?.detail || err.response?.data?.password?.[0];
      showToast(serverMessage || "Request failed. Check your inputs.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-tertiary p-10 rounded-[3rem] border border-secondary/5 shadow-2xl"
      >
        {!success && (
          <div className="flex justify-end mb-4">
            <button 
              type="button"
              onClick={toggleFlow}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-secondary/40 hover:text-secondary transition-colors"
            >
              Switch to {flow === 'email' ? 'SMS' : 'Email'} <ArrowLeftRight size={12} />
            </button>
          </div>
        )}

        <header className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={flow}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {flow === 'sms' ? <Smartphone className="text-secondary/20" size={32}/> : <Mail className="text-secondary/20" size={32}/>}
              </motion.div>
            </AnimatePresence>
          </div>
          <h1 className="font-header text-3xl font-black text-secondary tracking-tighter uppercase">
            {flow === 'sms' ? "Verify" : "New"} <span className="font-light">Password</span>
          </h1>
          <p className="text-[10px] text-secondary/40 uppercase tracking-[0.3em] mt-3 font-bold">
            {flow === 'sms' ? "Enter the OTP sent to your phone" : "Secure your account credentials"}
          </p>
        </header>

        {success ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 size={48} className="text-green-500 mx-auto animate-bounce" />
            <p className="text-xs font-black uppercase tracking-widest text-secondary">Success!</p>
            <p className="text-[10px] text-secondary/50 uppercase">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-6">
            <div className="space-y-4">
              {flow === 'sms' && (
                <>
                  <Input 
                    label="Phone Number" 
                    type="text" 
                    placeholder="+251..."
                    {...register("phone")} 
                    error={errors.phone?.message as string} 
                    defaultValue={phoneFromQuery ?? ''}
                    readOnly={!!phoneFromQuery}
                  />
                  <Input 
                    label="OTP Code" 
                    type="text" 
                    placeholder="123456"
                    {...register("otp_code")} 
                    error={errors.otp_code?.message as string} 
                  />
                </>
              )}

              <Input 
                label="New Password" 
                type="password" 
                placeholder="••••••••"
                {...register("password")} 
                error={errors.password?.message as string} 
              />
              <Input 
                label="Confirm New Password" 
                type="password" 
                placeholder="••••••••"
                {...register("confirmPassword")} 
                error={errors.confirmPassword?.message as string} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group flex items-center justify-between py-6 border-b border-secondary/10 hover:border-secondary transition-all disabled:opacity-50"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">
                {loading ? "Processing..." : "Reset Password"}
              </span>
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <KeyRound size={16} className="group-hover:rotate-12 transition-transform" />
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;