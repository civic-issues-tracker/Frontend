import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({ identity: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const input = formData.identity.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+251|0)[1-9]\d{8}$/;

    if (!input) {
      newErrors.identity = "Identity required";
    } else if (!emailRegex.test(input) && !phoneRegex.test(input)) {
      newErrors.identity = "Use a valid email or Ethiopian phone";
    }

    if (!formData.password) {
      newErrors.password = "Security key required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (validate()) {
    try {
      const response = await fetch('https://81e778cb-ebf8-4faf-bb46-a3412ad570ae.mock.pstmn.io/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.access) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('user_name', data.user?.name || formData.identity);
        
        console.log("Success! Authenticated as:", data.user.name);
        
        navigate('/'); 
      } else {
        setErrors({ identity: "Authentication failed. Check your mock example." });
      }
    } catch (error) {
      console.error("Connection Error: Is the Mock URL correct?", error);
      setErrors({ identity: "Mock Server Unreachable" });
    }
  }
};

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-10">
      <div className="space-y-8">
        <Input 
          label="Email or Phone" 
          placeholder="abebe@mail.com or 09..."
          value={formData.identity}
          onChange={(e) => handleChange('identity', e.target.value)}
          error={errors.identity}
        />
        <Input 
          label="Password" 
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
        />
      </div>

      <button 
        type="submit"
        className="w-full group flex items-center justify-between py-6 border-b border-secondary/10 hover:border-secondary transition-all"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">
          Login
        </span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
      </button>

      <div className="pt-4">
        <p className="text-[9px] text-secondary/30 uppercase tracking-widest leading-relaxed">
          Forgot credentials? <br />
          <span className="text-secondary/60 cursor-pointer hover:text-secondary italic">
            Initiate Recovery Process
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;