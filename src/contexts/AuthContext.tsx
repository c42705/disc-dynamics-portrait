
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage (for demo purposes)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
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
        const user = { id: crypto.randomUUID(), email };
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success('Successfully logged in');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
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
      const user = { id: crypto.randomUUID(), email, displayName: name };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Successfully registered');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Check your connection.');
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
      localStorage.removeItem('currentUser');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
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
    isAuthenticated
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
