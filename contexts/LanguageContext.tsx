import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'pt' | 'en' | 'es';

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

const translations: Translations = {
  'login.title': {
    pt: 'Bem-vindo à',
    en: 'Welcome to',
    es: 'Bienvenido a',
  },
  'login.subtitle': {
    pt: 'Acesse sua conta corporativa para continuar.',
    en: 'Access your corporate account to continue.',
    es: 'Accede a tu cuenta corporativa para continuar.',
  },
  'login.button.google': {
    pt: 'Entrar com o Google',
    en: 'Sign in with Google',
    es: 'Iniciar sesión con Google',
  },
  'login.button.submit': {
    pt: 'LOGIN',
    en: 'LOGIN',
    es: 'ENTRAR',
  },
  'login.or': {
    pt: 'ou',
    en: 'or',
    es: 'o',
  },
  'login.error.unauthorized_domain': {
    pt: 'Seu e-mail não pertence a um domínio corporativo autorizado.',
    en: 'Your email does not belong to an authorized corporate domain.',
    es: 'Tu correo no pertenece a un dominio corporativo autorizado.',
  },
  'login.error.default': {
    pt: 'Ocorreu um erro ao fazer login. Tente novamente.',
    en: 'An error occurred during login. Please try again.',
    es: 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.',
  },
  'login.footer.copyright': {
    pt: '© {year} Company Hero. Todos os direitos reservados.',
    en: '© {year} Company Hero. All rights reserved.',
    es: '© {year} Company Hero. Todos los derechos reservados.',
  },
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('finhero_language') as Language;
    if (savedLang && ['pt', 'en', 'es'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('finhero_language', lang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[key];
    let text = translation ? (translation[language] || translation['pt']) : key;
    
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
