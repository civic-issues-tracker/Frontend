import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { authService } from '../../auth/services/authService';

const VerifyEmailChangePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg("Verification token is missing.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmailChange(token);
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.error || "Verification failed or token expired.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-secondary/10">
        
        {loading && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-secondary mb-4" size={48} />
            <h2 className="text-2xl font-black text-secondary tracking-tight">Verifying Email...</h2>
            <p className="text-sm text-secondary/60 mt-2">Please wait while we confirm your new email address.</p>
          </div>
        )}

        {!loading && success && (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="text-green-500 mb-4" size={56} />
            <h2 className="text-2xl font-black text-secondary tracking-tight">Email Verified!</h2>
            <p className="text-sm text-secondary/70 mt-2 mb-6">
              Your email has been successfully updated. You will be redirected to the login page shortly.
            </p>
            <Link 
              to="/login"
              className="px-6 py-3 bg-secondary text-white font-bold rounded-full uppercase text-xs tracking-wider hover:bg-secondary/90 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {!loading && !success && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 mb-4" size={56} />
            <h2 className="text-2xl font-black text-secondary tracking-tight">Verification Failed</h2>
            <p className="text-sm text-secondary/70 mt-2 mb-6">{errorMsg}</p>
            <Link 
              to="/profile"
              className="px-6 py-3 bg-secondary text-white font-bold rounded-full uppercase text-xs tracking-wider hover:bg-secondary/90 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailChangePage;
