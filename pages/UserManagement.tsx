import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, UserCog, Shield, User } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

export const UserManagement: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList: UserData[] = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() } as UserData);
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  const toggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Erro ao atualizar a permissão do usuário.");
    }
  };

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
        {loading ? (
          <div className="p-12 text-center flex justify-center items-center h-48">
            <div className="w-8 h-8 border-4 border-[#FF0066] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Usuário</th>
                  <th scope="col" className="px-6 py-4">Função</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                      </div>
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          user.role === 'admin' 
                            ? 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
                            : 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        <UserCog size={14} />
                        {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
