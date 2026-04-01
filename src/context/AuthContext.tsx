import React, { createContext, useState, useCallback, useLayoutEffect } from 'react';
import { privateApi } from '../features/auth/services/authService';
import Toast, { type ToastType } from '../components/ui/Toast'; 

interface User {
  id: string;
  email?: string; 
  phone: string; 
  full_name: string; 
  role_name: 'resident' | 'system_admin' | 'organization'; 
  organizationId?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { access: string; user: User }) => void;
  logout: () => Promise<void>;
  updateToken: (newToken: string) => void;
  showToast: (msg: string, type: ToastType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from sessionStorage to handle page refreshes
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return sessionStorage.getItem('accessToken');
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' as ToastType });

  const showToast = (msg: string, type: ToastType) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const login = useCallback((data: { access: string; user: User }) => {
    setAccessToken(data.access);
    setUser(data.user);
    
    sessionStorage.setItem('accessToken', data.access);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    setIsLoading(false);
  }, []);

  const updateToken = useCallback((newToken: string) => {
    setAccessToken(newToken);
    sessionStorage.setItem('accessToken', newToken);
  }, []);

  // Interceptors for API logic
  useLayoutEffect(() => {
    const requestIntercept = privateApi.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization'] && accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = privateApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 429) {
          showToast("Security: Too many requests. Please slow down.", "error");
        }

        if (error.response?.status === 401) {
          logout();
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      privateApi.interceptors.request.eject(requestIntercept);
      privateApi.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]); 

  const logout = async () => {
    try {
      await privateApi.post('/auth/logout/'); 
      showToast("Logged out safely", "info");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      // Clear session storage
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      isAuthenticated: !!accessToken, 
      isLoading, 
      login, 
      logout,
      updateToken,
      showToast
    }}>
      {children}
      <Toast 
        isVisible={toast.show} 
        message={toast.msg} 
        type={toast.type} 
        onClose={() => setToast(p => ({...p, show: false}))} 
      />
    </AuthContext.Provider>
  );
};

export default AuthContext;