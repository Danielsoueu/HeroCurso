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