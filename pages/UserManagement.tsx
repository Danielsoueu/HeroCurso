import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, UserCog, Shield, User, Plus, RefreshCw, Search, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt?: any;
}

export const UserManagement: React.FC = () => {
  const { profile, isAdmin, user } = useAuth();
  const isUserAdmin = Boolean(isAdmin || profile?.role === 'admin');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
  const [savingUser, setSavingUser] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList: UserData[] = [];
      querySnapshot.forEach((docSnap) => {
        usersList.push({ id: docSnap.id, ...docSnap.data() } as UserData);
      });

      // If database is completely empty but current user is authenticated, ensure current user exists
      if (usersList.length === 0 && user?.email) {
        const currentUid = user.uid;
        const currentEmail = user.email.toLowerCase().trim();
        const userDocRef = doc(db, 'users', currentUid);
        const selfDoc: UserData = {
          id: currentUid,
          email: currentEmail,
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        try {
          await setDoc(userDocRef, {
            email: currentEmail,
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString()
          }, { merge: true });
          usersList.push(selfDoc);
        } catch (syncErr) {
          console.warn("Could not auto-seed admin profile:", syncErr);
        }
      }

      setUsers(usersList);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setErrorMessage(error?.message || "Não foi possível carregar os usuários do banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserAdmin) {
      fetchUsers();
    }
  }, [isUserAdmin]);

  const toggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast(`Permissão alterada para ${newRole === 'admin' ? 'Administrador' : 'Usuário'}.`);
    } catch (error: any) {
      console.error("Error updating role:", error);
      alert(`Erro ao atualizar a permissão do usuário: ${error?.message || 'Verifique as permissões do Firestore.'}`);
    }
  };

  const toggleStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      showToast(`Status alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}.`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(`Erro ao atualizar status: ${error?.message || 'Erro de permissão.'}`);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o usuário "${userEmail}" da lista?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(u => u.id !== userId));
      showToast(`Usuário ${userEmail} removido com sucesso.`);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(`Erro ao remover usuário: ${error?.message || 'Erro de permissão.'}`);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newUserEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert("Por favor, informe um e-mail válido.");
      return;
    }

    setSavingUser(true);
    try {
      // Use sanitized email as doc ID if no UID yet
      const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
      const userRef = doc(db, 'users', docId);

      const newUserData = {
        email: cleanEmail,
        role: newUserRole,
        status: 'active' as const,
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, newUserData, { merge: true });

      const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (existingIndex >= 0) {
        setUsers(users.map((u, i) => i === existingIndex ? { id: docId, ...newUserData } : u));
      } else {
        setUsers([...users, { id: docId, ...newUserData }]);
      }

      setIsModalOpen(false);
      setNewUserEmail('');
      setNewUserRole('user');
      showToast(`Usuário ${cleanEmail} cadastrado com sucesso!`);
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(`Erro ao cadastrar usuário: ${error?.message || 'Erro de permissão no Firestore.'}`);
    } finally {
      setSavingUser(false);
    }
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => {
      setActionSuccess(null);
    }, 4000);
  };

  if (!isUserAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Restrito</h2>
        <p className="text-slate-500 max-w-md">
          Você não tem permissão para visualizar esta página. Esta área é restrita para administradores autorizados.
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q) || u.status?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Gestão de Usuários</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie os acessos, permissões e adicione novos membros da equipe Company Hero.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            title="Atualizar lista"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-slate-400" : "text-slate-600"} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#FF0066] hover:bg-[#E6005C] rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Adicionar Usuário</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
          <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1 text-sm">
            <p className="font-semibold">Erro ao comunicar com a base de usuários:</p>
            <p className="mt-0.5 text-red-700">{errorMessage}</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 bg-white border border-red-200 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por e-mail ou perfil..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
          <span>Total cadastrados: <strong className="text-slate-800 font-semibold">{users.length}</strong></span>
          <span className="inline-block w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
          <span>Admins: <strong className="text-purple-700 font-semibold">{users.filter(u => u.role === 'admin').length}</strong></span>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center flex flex-col justify-center items-center">
            <div className="w-9 h-9 border-4 border-[#FF0066] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-slate-600">Carregando lista de usuários...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Usuário</th>
                  <th scope="col" className="px-6 py-4">Perfil / Função</th>
                  <th scope="col" className="px-6 py-4">Status de Acesso</th>
                  <th scope="col" className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((item) => {
                  const isCurrent = user?.email?.toLowerCase().trim() === item.email?.toLowerCase().trim();
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            item.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-semibold text-slate-900 truncate flex items-center gap-2">
                              {item.email}
                              {isCurrent && (
                                <span className="text-[10px] font-bold uppercase bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">
                                  Você
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 truncate">ID: {item.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.role === 'admin' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.role === 'admin' ? 'bg-purple-600' : 'bg-slate-400'}`}></span>
                          {item.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(item.id, item.status)}
                          title="Clique para alternar status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
                            item.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {item.status === 'active' ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => toggleRole(item.id, item.role)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                              item.role === 'admin' 
                                ? 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50' 
                                : 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100'
                            }`}
                          >
                            <UserCog size={14} />
                            <span>{item.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}</span>
                          </button>

                          {!isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(item.id, item.email)}
                              title="Remover usuário"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center">
                        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                          <User size={28} />
                        </div>
                        <p className="text-base font-semibold text-slate-800 mb-1">
                          {searchQuery ? "Nenhum usuário corresponde à busca" : "Nenhum usuário cadastrado no momento"}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                          {searchQuery 
                            ? `Nenhum registro encontrado com o termo "${searchQuery}".` 
                            : "Você pode adicionar os membros da sua equipe Company Hero manualmente clicando no botão abaixo."}
                        </p>
                        {!searchQuery && (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#FF0066] hover:bg-[#E6005C] rounded-xl shadow-sm transition-all cursor-pointer"
                          >
                            <Plus size={16} />
                            <span>Cadastrar Novo Usuário</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Adicionar Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#FF0066] flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Cadastrar Novo Usuário</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5 tracking-wider">
                  E-mail do Usuário
                </label>
                <input
                  type="email"
                  required
                  placeholder="ex: colaborador@companyhero.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Permite login com a conta Google corporativa da Company Hero.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5 tracking-wider">
                  Nível de Permissão
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] transition-all text-slate-800"
                >
                  <option value="user">Usuário Padrão (Acesso ao Dashboard e Conteúdos)</option>
                  <option value="admin">Administrador (Acesso total e Gestão de Usuários)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#FF0066] hover:bg-[#E6005C] rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {savingUser ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Salvar Usuário</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
