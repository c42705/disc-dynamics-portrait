
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { saveSheetConfiguration } from '@/services/googleSheetService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save } from 'lucide-react';

const AdminPage = () => {
  const { t } = useLanguage();
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [scriptUrl, setScriptUrl] = useState('');
  const [secretToken, setSecretToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState('');
  
  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated) {
      toast.error(t('admin.accessDenied'));
      navigate('/');
      return;
    }
    
    if (!isAdmin) {
      toast.error(t('admin.accessDenied'));
      navigate('/');
      return;
    }
    
    // Load existing configuration if available
    try {
      const storedConfig = localStorage.getItem('googleSheetConfig');
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        setScriptUrl(config.scriptUrl || '');
        setSecretToken(config.secretToken || '');
      }
    } catch (error) {
      console.error('Error loading Google Sheet configuration:', error);
    }
  }, [isAuthenticated, isAdmin, navigate, t]);
  
  const validateUrl = (url: string): boolean => {
    // Basic validation for Google Apps Script URL
    const regex = /https:\/\/script\.google\.com\/.*/;
    return regex.test(url);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    
    if (!validateUrl(scriptUrl)) {
      setUrlError(t('admin.googleSheet.invalidUrl'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = saveSheetConfiguration(scriptUrl, secretToken);
      if (success) {
        toast.success(t('admin.googleSheet.saveSuccess'));
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('admin.accessDenied')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
        <p className="text-muted-foreground">{t('admin.subtitle')}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.googleSheet.title')}</CardTitle>
          <CardDescription>{t('admin.googleSheet.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="scriptUrl" className="text-sm font-medium">
                {t('admin.googleSheet.scriptUrlLabel')}
              </label>
              <Input
                id="scriptUrl"
                type="url"
                value={scriptUrl}
                onChange={(e) => {
                  setScriptUrl(e.target.value);
                  setUrlError('');
                }}
                placeholder="https://script.google.com/macros/s/your-script-id/exec"
                required
                className={urlError ? "border-red-500" : ""}
              />
              {urlError && (
                <p className="text-sm text-red-500">
                  {urlError}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {t('admin.googleSheet.scriptUrlHelp')}
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="secretToken" className="text-sm font-medium">
                {t('admin.googleSheet.secretTokenLabel')}
              </label>
              <Input
                id="secretToken"
                type="text"
                value={secretToken}
                onChange={(e) => setSecretToken(e.target.value)}
                placeholder={t('admin.googleSheet.secretTokenPlaceholder')}
              />
              <p className="text-sm text-muted-foreground">
                {t('admin.googleSheet.secretTokenHelp')}
              </p>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  {t('common.saving')}
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  {t('admin.googleSheet.saveButton')}
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex flex-col space-y-2 items-start text-sm">
          <p>
            <strong>{t('admin.tips.title')}:</strong> {t('admin.tips.deployAsWebApp')}
          </p>
          <code className="bg-muted p-2 rounded text-xs w-full overflow-x-auto">
            {`function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
  
  // Add validation for the secret token
  if (data.token !== 'YOUR_SECRET_TOKEN') {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid token' }));
  }
  
  // Append data to sheet
  sheet.appendRow([
    data.userId,
    data.userName,
    data.timestamp,
    data.scores.dominance,
    data.scores.influence,
    data.scores.steadiness,
    data.scores.compliance,
    data.language
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }));
}`}
          </code>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPage;
