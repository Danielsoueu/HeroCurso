import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { profile } = useAuth();

  if (profile?.role !== 'admin') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Restrito</h2>
        <p className="text-slate-500 max-w-md">
          Você não tem permissão para visualizar esta página. Esta área é restrita para administradores do sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gestão de Usuários</h1>
        <p className="text-slate-500 mt-1">Gerencie os acessos e permissões da equipe.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-12 text-center text-slate-500">
          <p>Módulo de gestão de usuários em desenvolvimento.</p>
        </div>
      </div>
    </div>
  );
};
