
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm = ({ onSuccess, onRegisterClick }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t('auth.validation.allFieldsRequired'));
      return;
    }
    
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled in the login function
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('auth.email')}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('auth.password')}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('auth.login')}
        </Button>
      </form>
      <div className="text-center text-sm">
        <p>
          {t('auth.noAccount')}{' '}
          <Button variant="link" onClick={onRegisterClick} className="p-0">
            {t('auth.register')}
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
