import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Moon, Sun, AlertCircle, Mail, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { signInWithGoogle, signInWithCorporateEmail } = useAuth();
  const [corporateEmail, setCorporateEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const currentYear = new Date().getFullYear();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      const isFirebaseDomainError = 
        err?.code === 'auth/unauthorized-domain' || 
        err?.message?.includes('auth/unauthorized-domain') ||
        String(err)?.includes('unauthorized-domain');

      if (err.message === 'inactive-user') {
        setError(t('login.error.inactive'));
      } else if (err.message === 'unauthorized-email') {
        setError(t('login.error.unauthorized_email'));
      } else if (err.message === 'unauthorized-domain' || isFirebaseDomainError) {
        setError('O pop-up do Google pode estar bloqueado neste domínio. Digite seu e-mail corporativo abaixo para acessar diretamente.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        // user closed popup, ignore
      } else {
        setError(t('login.error.default'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCorporateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corporateEmail.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithCorporateEmail(corporateEmail);
    } catch (err: any) {
      console.error('Corporate login error:', err);
      if (err.message === 'invalid-format') {
        setError(t('login.error.invalid_format'));
      } else if (err.message === 'inactive-user') {
        setError(t('login.error.inactive'));
      } else if (err.message === 'unauthorized-email') {
        setError(t('login.error.unauthorized_email'));
      } else {
        setError(t('login.error.default'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-sans transition-colors ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Top Brand Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF0066]" />

      {/* Subtle Background Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF0066]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-2 rounded-full border transition-colors shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
          title="Alternar tema"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className={`flex items-center border rounded-full p-1 shadow-sm transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          {(['pt', 'en', 'es'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 text-xs font-semibold uppercase rounded-full transition-colors ${
                language === lang
                  ? 'bg-slate-800 text-white'
                  : theme === 'dark' ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Center Card */}
      <div className={`w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border z-10 mx-4 transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF0066]/10 flex items-center justify-center text-[#FF0066]">
            <Building2 size={24} strokeWidth={2.5} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t('login.title')} <span className="text-[#FF0066]">Hero</span>
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t('login.subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex gap-3 text-sm border border-red-100 items-start animate-fade-in">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Google Login Option */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 border font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-sm text-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'}`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t('login.button.google')}
        </button>

        <div className="relative flex items-center py-3">
          <div className={`flex-grow border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}></div>
          <span className={`flex-shrink-0 mx-3 text-xs uppercase tracking-wider font-semibold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('login.or')}
          </span>
          <div className={`flex-grow border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}></div>
        </div>

        {/* Corporate Direct Email Login */}
        <form onSubmit={handleCorporateLogin} className="space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('login.corporate_email.label')}
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} size={17} />
              <input
                type="email"
                required
                value={corporateEmail}
                onChange={(e) => setCorporateEmail(e.target.value)}
                placeholder={t('login.corporate_email.placeholder')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
            <p className={`text-[11px] mt-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Permitido: @companyhero.com, @companyhero.com.br e usuários cadastrados.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !corporateEmail.trim()}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            {loading ? 'Entrando...' : (
              <>
                <span>{t('login.corporate_email.button')}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className={`absolute bottom-6 text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
        {t('login.footer.copyright', { year: currentYear.toString() })}
      </div>
    </div>
  );
};
