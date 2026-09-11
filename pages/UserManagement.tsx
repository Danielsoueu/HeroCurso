import React, { useEffect, useState } from 'react';
import { useAuth, isSuperAdmin } from '../contexts/AuthContext';
import { ShieldAlert, UserCog, Shield, User, Plus, RefreshCw, Search, Trash2, CheckCircle, X, Clock, Activity } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserData {
  id: string;
  docIds: string[];
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt?: string;
}

function formatLastLogin(dateStr?: string): { text: string; isOnline: boolean } {
  if (!dateStr) {
    return { text: 'Aguardando 1º acesso', isOnline: false };
  }
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);

    const isOnline = diffMin < 20;

    if (diffMin < 1) return { text: 'Online agora', isOnline: true };
    if (diffMin < 60) return { text: `Há ${diffMin} min`, isOnline };
    if (diffHours < 24) {
      return { 
        text: `Hoje às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, 
        isOnline: false 
      };
    }
    return { 
      text: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }), 
      isOnline: false 
    };
  } catch (e) {
    return { text: 'Acessou recentemente', isOnline: false };
  }
}

export const UserManagement: React.FC = () => {
  const { profile, isAdmin, user } = useAuth();
  const isUserAdmin = Boolean(isAdmin || profile?.role === 'admin');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
  const [formError, setFormError] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Helper to merge Firestore docs by normalized email
  const processSnapshotDocs = (docs: any[]): UserData[] => {
    const userMap = new Map<string, UserData>();

    docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data) return;

      let email = data.email ? String(data.email).trim().toLowerCase() : '';
      // If doc has no explicit email field, check if doc id is a sanitized email
      if (!email && docSnap.id.includes('_') && (docSnap.id.includes('companyhero') || docSnap.id.includes('gmail') || docSnap.id.includes('com'))) {
        email = docSnap.id.replace(/_/g, '.').replace(/\.com(\.br)?/, (m: string) => '@' + m.slice(1));
      }

      if (!email || !email.includes('@')) return;

      const cleanEmail = email.toLowerCase().trim();
      const isSuper = isSuperAdmin(cleanEmail);
      const existing = userMap.get(cleanEmail);

      const resolvedRole: 'admin' | 'user' = isSuper ? 'admin' : (data.role === 'admin' || existing?.role === 'admin' ? 'admin' : 'user');
      const resolvedStatus: 'active' | 'inactive' = (data.status === 'inactive' || existing?.status === 'inactive') ? 'inactive' : 'active';

      // Keep latest lastLogin
      let latestLogin = existing?.lastLogin;
      if (data.lastLogin) {
        if (!latestLogin || new Date(data.lastLogin).getTime() > new Date(latestLogin).getTime()) {
          latestLogin = data.lastLogin;
        }
      }

      // Keep earliest createdAt
      let earliestCreated = existing?.createdAt || data.createdAt || new Date().toISOString();
      if (data.createdAt && existing?.createdAt) {
        if (new Date(data.createdAt).getTime() < new Date(existing.createdAt).getTime()) {
          earliestCreated = data.createdAt;
        }
      }

      const docIds = existing?.docIds ? Array.from(new Set([...existing.docIds, docSnap.id])) : [docSnap.id];

      userMap.set(cleanEmail, {
        id: existing?.id || docSnap.id,
        docIds,
        email: cleanEmail,
        displayName: data.displayName || existing?.displayName || cleanEmail.split('@')[0],
        role: resolvedRole,
        status: resolvedStatus,
        lastLogin: latestLogin,
        createdAt: earliestCreated
      });
    });

    // Ensure current admin user is in the list
    if (user?.email) {
      const currentEmail = user.email.toLowerCase().trim();
      if (!userMap.has(currentEmail)) {
        userMap.set(currentEmail, {
          id: user.uid,
          docIds: [user.uid],
          email: currentEmail,
          displayName: (user as any).displayName || currentEmail.split('@')[0],
          role: 'admin',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
      }
    }

    // Sort by lastLogin (most recent first)
    return Array.from(userMap.values()).sort((a, b) => {
      const timeA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
      const timeB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
      return timeB - timeA;
    });
  };

  // Realtime synchronization via onSnapshot
  useEffect(() => {
    if (!isUserAdmin) return;

    setLoading(true);
    const usersCol = collection(db, 'users');

    const unsubscribe = onSnapshot(usersCol, (snapshot) => {
      const parsedList = processSnapshotDocs(snapshot.docs);
      setUsers(parsedList);
      localStorage.setItem('hero_users_cache', JSON.stringify(parsedList));
      setLoading(false);
    }, (error) => {
      console.warn("Realtime listener notice (using cached fallback):", error);
      const cached = localStorage.getItem('hero_users_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
          }
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isUserAdmin, user?.email]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const parsedList = processSnapshotDocs(snap.docs);
      setUsers(parsedList);
      localStorage.setItem('hero_users_cache', JSON.stringify(parsedList));
      showToast("Lista de usuários atualizada!");
    } catch (e: any) {
      console.warn("Manual refresh notice:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleRole = async (targetUser: UserData) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const updated = users.map(u => u.email === targetUser.email ? { ...u, role: newRole } : u);
    setUsers(updated);
    localStorage.setItem('hero_users_cache', JSON.stringify(updated));

    // Update in Firestore for all corresponding doc IDs
    const promises = (targetUser.docIds || [targetUser.id]).map(id => 
      updateDoc(doc(db, 'users', id), { role: newRole }).catch(() => {})
    );
    const altDocId = targetUser.email.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
    promises.push(setDoc(doc(db, 'users', altDocId), { role: newRole }, { merge: true }).catch(() => {}));

    await Promise.all(promises);
    showToast(`Permissão de ${targetUser.email} alterada para ${newRole === 'admin' ? 'Administrador' : 'Usuário'}.`);
  };

  const toggleStatus = async (targetUser: UserData) => {
    const newStatus = targetUser.status === 'active' ? 'inactive' : 'active';
    const updated = users.map(u => u.email === targetUser.email ? { ...u, status: newStatus } : u);
    setUsers(updated);
    localStorage.setItem('hero_users_cache', JSON.stringify(updated));

    // Update in Firestore for all corresponding doc IDs
    const promises = (targetUser.docIds || [targetUser.id]).map(id => 
      updateDoc(doc(db, 'users', id), { status: newStatus }).catch(() => {})
    );
    const altDocId = targetUser.email.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
    promises.push(setDoc(doc(db, 'users', altDocId), { status: newStatus }, { merge: true }).catch(() => {}));

    await Promise.all(promises);
    showToast(`Status de ${targetUser.email} alterado para ${newStatus === 'active' ? 'Ativo' : 'Inativo'}.`);
  };

  const handleDeleteUser = async (targetUser: UserData) => {
    if (!window.confirm(`Tem certeza que deseja remover o usuário "${targetUser.email}" da lista?`)) {
      return;
    }

    const updated = users.filter(u => u.email !== targetUser.email);
    setUsers(updated);
    localStorage.setItem('hero_users_cache', JSON.stringify(updated));

    // Delete in Firestore for all corresponding doc IDs
    const promises = (targetUser.docIds || [targetUser.id]).map(id => 
      deleteDoc(doc(db, 'users', id)).catch(() => {})
    );
    const altDocId = targetUser.email.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
    promises.push(deleteDoc(doc(db, 'users', altDocId)).catch(() => {}));

    await Promise.all(promises);
    showToast(`Usuário ${targetUser.email} removido.`);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const cleanEmail = newUserEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setFormError("Por favor, informe um endereço de e-mail corporativo válido.");
      return;
    }

    setSavingUser(true);
    const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
    const newUserData: UserData = {
      id: docId,
      docIds: [docId],
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      role: newUserRole,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Optimistically update list and cache
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    const updatedList = existingIndex >= 0 
      ? users.map((u, i) => i === existingIndex ? { ...u, ...newUserData, docIds: Array.from(new Set([...u.docIds, docId])) } : u)
      : [newUserData, ...users];

    setUsers(updatedList);
    localStorage.setItem('hero_users_cache', JSON.stringify(updatedList));

    try {
      const userRef = doc(db, 'users', docId);
      await setDoc(userRef, {
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: newUserRole,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      showToast(`Usuário ${cleanEmail} cadastrado com sucesso!`);
      setIsModalOpen(false);
      setNewUserEmail('');
      setNewUserRole('user');
    } catch (error: any) {
      console.warn("Notice creating user in Firestore:", error);
      showToast(`Usuário ${cleanEmail} salvo localmente.`);
      setIsModalOpen(false);
      setNewUserEmail('');
      setNewUserRole('user');
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
    return u.email?.toLowerCase().includes(q) || 
           u.displayName?.toLowerCase().includes(q) ||
           u.role?.toLowerCase().includes(q) || 
           u.status?.toLowerCase().includes(q);
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Gestão de Usuários</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Tempo Real
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Monitore quem acessou a plataforma, gerencie permissões e adicione novos colaboradores.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            title="Atualizar lista agora"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin text-slate-400" : "text-slate-600"} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#FF0066] hover:bg-[#E6005C] rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Cadastrar Novo Usuário</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por e-mail, nome ou perfil..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
          <span>Cadastrados: <strong className="text-slate-800 font-semibold">{users.length}</strong></span>
          <span className="inline-block w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Online / Recente: <strong className="text-emerald-600 font-semibold">{users.filter(u => formatLastLogin(u.lastLogin).isOnline).length}</strong></span>
          <span className="inline-block w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Admins: <strong className="text-purple-700 font-semibold">{users.filter(u => u.role === 'admin').length}</strong></span>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center flex flex-col justify-center items-center">
            <div className="w-9 h-9 border-4 border-[#FF0066] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-slate-600">Sincronizando usuários em tempo real...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Colaborador / Usuário</th>
                  <th scope="col" className="px-6 py-4">Último Acesso</th>
                  <th scope="col" className="px-6 py-4">Perfil / Função</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((item) => {
                  const isCurrent = user?.email?.toLowerCase().trim() === item.email?.toLowerCase().trim();
                  const access = formatLastLogin(item.lastLogin);

                  return (
                    <tr key={item.email} className="hover:bg-slate-50/80 transition-colors">
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
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900 truncate">
                                {item.email}
                              </p>
                              {isCurrent && (
                                <span className="text-[10px] font-bold uppercase bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">
                                  Você
                                </span>
                              )}
                            </div>
                            {item.displayName && item.displayName !== item.email && (
                              <p className="text-xs text-slate-500 truncate">{item.displayName}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${
                            access.isOnline ? 'bg-emerald-500 animate-ping' : item.lastLogin ? 'bg-slate-300' : 'bg-amber-400'
                          }`}></span>
                          <span className={`text-xs font-medium ${access.isOnline ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}>
                            {access.text}
                          </span>
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
                          onClick={() => toggleStatus(item)}
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
                            onClick={() => toggleRole(item)}
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
                              onClick={() => handleDeleteUser(item)}
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
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="max-w-sm mx-auto flex flex-col items-center">
                        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                          <User size={28} />
                        </div>
                        <p className="text-base font-semibold text-slate-800 mb-1">
                          {searchQuery ? "Nenhum usuário corresponde à busca" : "Nenhum usuário encontrado"}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                          {searchQuery 
                            ? `Nenhum registro encontrado com o termo "${searchQuery}".` 
                            : "Quando um colaborador faz login ou é adicionado, ele aparece automaticamente aqui em tempo real."}
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
              {formError && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5 tracking-wider">
                  E-mail do Colaborador
                </label>
                <input
                  type="email"
                  required
                  placeholder="ex: colaborador@companyhero.com"
                  value={newUserEmail}
                  onChange={(e) => {
                    setNewUserEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Permite login com a conta Google corporativa ou direto pelo e-mail.
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
                  disabled={savingUser || !newUserEmail.trim()}
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
