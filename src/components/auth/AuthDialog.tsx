
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthDialogProps {
  trigger?: React.ReactNode;
}

const AuthDialog = ({ trigger }: AuthDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            {t('auth.loginOrRegister')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('auth.welcomeTitle')}</DialogTitle>
          <DialogDescription>
            {t('auth.welcomeDescription')}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm 
              onSuccess={handleSuccess} 
              onRegisterClick={() => setActiveTab('register')} 
            />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm 
              onSuccess={handleSuccess} 
              onLoginClick={() => setActiveTab('login')} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
