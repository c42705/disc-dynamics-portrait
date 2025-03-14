
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const RegisterForm = ({ onSuccess, onLoginClick }: RegisterFormProps) => {
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error(t('auth.validation.allFieldsRequired'));
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t('auth.validation.passwordsDoNotMatch'));
      return;
    }
    
    try {
      await register(email, password, name);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is already handled in the register function
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('auth.name')}
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.namePlaceholder')}
            disabled={isLoading}
          />
        </div>
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
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {t('auth.confirmPassword')}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('auth.register')}
        </Button>
      </form>
      <div className="text-center text-sm">
        <p>
          {t('auth.haveAccount')}{' '}
          <Button variant="link" onClick={onLoginClick} className="p-0">
            {t('auth.login')}
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
