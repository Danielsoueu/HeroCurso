import { ReactNode } from 'react';

export interface Module {
  id: number;
  title: string;
  description?: string;
  icon: ReactNode;
  duration: string;
  content: ReactNode;
  category?: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  status: 'active' | 'construction';
  color: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';       // Papel no sistema
  status: 'active' | 'blocked'; // Se 'blocked', o login é negado
  domain?: string;              // Domínio extraído do e-mail (ex: companyhero.com)
  createdAt: string;            // Data ISO de criação
  lastLoginAt: string;          // Atualizado a cada login
}

export interface WorkspaceSettings {
  domainRestrictionEnabled: boolean; // Liga/desliga a restrição
  allowedDomain?: string;            // Ex: "companyhero.com"
  allowedEmails?: string[];          // Ex: ["parceiro@externo.com"]
  updatedAt: string;
  updatedBy?: string;
}
