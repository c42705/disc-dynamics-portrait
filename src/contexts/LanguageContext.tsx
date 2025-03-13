
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

type Language = 'en' | 'es';
type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get stored language or default to 'en'
  const getInitialLanguage = (): Language => {
    try {
      const storedLang = localStorage.getItem('language') as Language;
      return storedLang === 'en' || storedLang === 'es' ? storedLang : 'en';
    } catch (error) {
      console.error('Error accessing localStorage for language:', error);
      return 'en';
    }
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<Translations>(
    language === 'en' ? enTranslations : esTranslations
  );

  // Load translations based on selected language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const trans = language === 'en' ? enTranslations : esTranslations;
        setTranslations(trans);
        
        try {
          localStorage.setItem('language', language);
        } catch (error) {
          console.error('Error saving language to localStorage:', error);
        }
      } catch (error) {
        console.error('Failed to load language resources:', error);
        setTranslations(enTranslations);
        setLanguage('en');
        toast.error('Language resources unavailable. Defaulting to English.');
      }
    };

    loadTranslations();
  }, [language]);

  // Function to get a translation by key path (e.g., "test.intro.title")
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    try {
      for (const k of keys) {
        value = value[k];
      }
      
      if (typeof value === 'string') {
        return value;
      }
      return key; // Fallback to key if not found
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, translations, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
