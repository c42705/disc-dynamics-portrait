
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, History, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AuthDialog from './auth/AuthDialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { language, changeLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'es' : 'en');
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center text-xl font-bold">
            <span className="text-primary">DISC</span>
            <span className="text-muted-foreground">Test</span>
          </Link>
        </div>
        
        {!isMobile ? (
          <>
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                {t('nav.home')}
              </Link>
              <Link to="/test" className="text-sm font-medium transition-colors hover:text-primary">
                {t('nav.test')}
              </Link>
              {isAuthenticated && (
                <Link to="/history" className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.history')}
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                  {t('nav.admin')}
                </Link>
              )}
            </nav>
            
            <div className="flex-1 flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Language"
                className="text-sm"
                onClick={toggleLanguage}
              >
                {language === 'en' ? 'ES' : 'EN'}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Theme"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-2">
                      {currentUser?.displayName || currentUser?.email || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t('nav.account')}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate('/history')}>
                      <History className="mr-2 h-4 w-4" />
                      {t('nav.history')}
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        {t('nav.admin')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('auth.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthDialog />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Menu"
              className="mr-1"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container pb-2">
          <nav className="flex flex-col space-y-3 p-2 bg-muted/50 rounded-md">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/test" 
              className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.test')}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/history" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.history')}
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.admin')}
              </Link>
            )}
            <div className="flex items-center justify-between pt-2 border-t">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Language"
                onClick={toggleLanguage}
              >
                {language === 'en' ? 'ES' : 'EN'}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Theme"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </Button>
              ) : (
                <AuthDialog />
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
