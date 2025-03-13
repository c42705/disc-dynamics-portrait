
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { language, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold">
            {t('app.title')}
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            {t('app.nav.home')}
          </Link>
          <Link 
            to="/test" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/test' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            {t('app.nav.test')}
          </Link>
          <Link 
            to="/results" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/results' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            {t('app.nav.results')}
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Globe className="h-5 w-5" />
                <span className="sr-only">
                  {t('language.' + language)}
                </span>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {language.toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => changeLanguage('en')}
                className={language === 'en' ? 'bg-muted' : ''}
              >
                {t('language.en')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeLanguage('es')}
                className={language === 'es' ? 'bg-muted' : ''}
              >
                {t('language.es')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="flex items-center justify-center"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">
              {t(theme === 'light' ? 'theme.dark' : 'theme.light')}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
