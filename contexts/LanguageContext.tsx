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
  'login.corporate_email.label': {
    pt: 'Ou acesse diretamente com seu e-mail:',
    en: 'Or access directly with your email:',
    es: 'O accede directamente con tu correo:',
  },
  'login.corporate_email.placeholder': {
    pt: 'ex: nome@companyhero.com',
    en: 'ex: name@companyhero.com',
    es: 'ej: nombre@companyhero.com',
  },
  'login.corporate_email.button': {
    pt: 'Acessar Plataforma',
    en: 'Access Platform',
    es: 'Acceder a la Plataforma',
  },
  'login.error.unauthorized_email': {
    pt: 'Acesso restrito para colaboradores Company Hero (@companyhero.com / @companyhero.com.br) ou convidados autorizados pela administração.',
    en: 'Access restricted to Company Hero team members (@companyhero.com / @companyhero.com.br) or authorized users.',
    es: 'Acceso restringido para colaboradores de Company Hero (@companyhero.com / @companyhero.com.br) o usuarios autorizados.',
  },
  'login.error.inactive': {
    pt: 'Seu acesso está inativo no momento. Entre em contato com um administrador para reativar seu cadastro.',
    en: 'Your account is currently inactive. Please contact an administrator to reactivate your access.',
    es: 'Tu cuenta está inactiva actualmente. Contacta a un administrador para reactivar tu acceso.',
  },
  'login.error.invalid_format': {
    pt: 'Por favor, informe um endereço de e-mail válido.',
    en: 'Please enter a valid email address.',
    es: 'Por favor, ingresa una dirección de correo válida.',
  },
  'login.error.unauthorized_domain': {
    pt: 'Acesso não autorizado. Utilize seu e-mail @companyhero.com ou @companyhero.com.br.',
    en: 'Unauthorized access. Please use your @companyhero.com or @companyhero.com.br email.',
    es: 'Acceso no autorizado. Utiliza tu correo @companyhero.com o @companyhero.com.br.',
  },
  'login.error.default': {
    pt: 'Ocorreu um erro ao fazer login. Você também pode acessar digitando seu e-mail corporativo abaixo.',
    en: 'An error occurred during login. You can also sign in by entering your corporate email below.',
    es: 'Ocurrió un error al iniciar sesión. También puedes acceder ingresando tu correo corporativo abajo.',
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
