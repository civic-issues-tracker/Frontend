import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Send, Mail, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../../src/components/ui/Input';
import { Button } from '../../../components/ui/Button';

// Validations
const NAME_REGEX = /^[a-zA-Z\s]*$/;
const ETH_PHONE_REGEX = /^(?:\+251|0)[1-9]\d{8}$/;

const SignupForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required.";
    } else if (!NAME_REGEX.test(formData.fullName)) {
      newErrors.fullName = "Names cannot contain numbers or symbols.";
    } else if (formData.fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Please enter your first and last name.";
    }

    if (!ETH_PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = "Enter a valid Ethiopian phone number (09... or +251...).";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Security requires at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) setStep(2);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // --- NEW MOCK API LOGIC ---
  const handleSignup = async (method: 'telegram' | 'email') => {
    try {
      const response = await fetch('https://81e778cb-ebf8-4faf-bb46-a3412ad570ae.mock.pstmn.io/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          verificationMethod: method
        }),
      });

      const data = await response.json();

      if (data.access) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('user_name', formData.fullName); 
               
        console.log(`Signup Success via ${method}! Token saved.`);
        navigate('/'); 
      }
    } catch (error) {
      console.error("Mock Server Connection Failed:", error);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-115">
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="space-y-10"
          >
            <div className="space-y-8">
              <Input 
                label="Full Name" 
                placeholder="Abebe Balcha"
                error={errors.fullName}
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
              <Input 
                label="Contact / Phone" 
                placeholder="0911..."
                error={errors.phone}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <Input 
                label="Secure / Password" 
                type="password"
                placeholder="••••••••"
                error={errors.password}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>

            <button 
              onClick={handleContinue}
              className="w-full group flex items-center justify-between py-6 border-b border-secondary/10 hover:border-secondary transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">
                Verify Credentials
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
            <a href="/login" className="text-[9px] font-black uppercase tracking-[0.3em] text-secondary">Already have an account? <span className='border-b boredr-secondary'>Login</span></a>
          </motion.div>
        )}

        {/*VERIFICATION PART */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="space-y-12 pt-2"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-500/60">
                <CheckCircle2 size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Data Validated</span>
              </div>
              <h4 className="text-3xl font-header font-light text-secondary uppercase leading-none tracking-tight">
                Security <br />
                <span className="text-secondary/60 italic lowercase">Verification</span>
              </h4>
              <p className="text-[11px] text-secondary/70 font-body leading-relaxed max-w-60">
                Choose an encrypted channel to receive your activation code.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Telegram  */}
              <Button 
                onClick={() => handleSignup('telegram')}
                className="flex items-center gap-6 p-6 border border-secondary/5 hover:border-secondary/20 hover:bg-secondary/5 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                  <Send size={16} strokeWidth={1.2} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-primary">Telegram Bot</span>
                  <span className="text-[8px] text-primary/60 uppercase tracking-tighter">Fastest Activation</span>
                </div>
              </Button>

              {/* Email  */}
              <Button 
                onClick={() => handleSignup('email')}
                className="flex items-center gap-6 p-6 border border-secondary/5 hover:border-secondary/20 hover:bg-secondary/5 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all">
                  <Mail size={16} strokeWidth={1.2} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-primary">Email SMTP</span>
                  <span className="text-[8px] text-primary/60 uppercase tracking-tighter">Standard OTP Route</span>
                </div>
              </Button>
            </div>

            <Button 
              onClick={() => setStep(1)}
              className="group flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-primary/20 hover:text-primary transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Edit Identity
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SignupForm;