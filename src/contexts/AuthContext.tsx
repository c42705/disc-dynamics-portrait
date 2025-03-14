
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

interface User {
  id: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkIsAdmin: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the admin email
const ADMIN_EMAIL = 'carlos.graphk@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useLanguage();

  // Check if a user is an admin based on their email
  const checkIsAdmin = (email: string): boolean => {
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  };

  useEffect(() => {
    // Check if user is stored in localStorage (for demo purposes)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const isUserAdmin = checkIsAdmin(user.email);
        
        setCurrentUser({
          ...user,
          isAdmin: isUserAdmin
        });
        setIsAuthenticated(true);
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      // Simulate API call for authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - in a real app, this would verify credentials with Firebase
      if (email && password) {
        const isUserAdmin = checkIsAdmin(email);
        const user = { 
          id: crypto.randomUUID(), 
          email,
          isAdmin: isUserAdmin
        };
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        setIsAdmin(isUserAdmin);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success(t('auth.login') + ' ' + t('common.success'));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('auth.validation.invalidEmail'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setIsLoading(true);
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - in a real app, this would register with Firebase
      const isUserAdmin = checkIsAdmin(email);
      const user = { 
        id: crypto.randomUUID(), 
        email, 
        displayName: name,
        isAdmin: isUserAdmin
      };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAdmin(isUserAdmin);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success(t('auth.register') + ' ' + t('common.success'));
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(t('auth.validation.invalidEmail'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Simulate API call for logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes - in a real app, this would sign out from Firebase
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem('currentUser');
      toast.success(t('auth.logout') + ' ' + t('common.success'));
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('common.error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    checkIsAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
