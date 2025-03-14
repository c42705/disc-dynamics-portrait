
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

import Navbar from './components/Navbar';
import IndexPage from './pages/Index';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
