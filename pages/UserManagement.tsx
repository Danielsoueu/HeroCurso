import React, { useEffect, useState } from 'react';
import { useAuth, isSuperAdmin } from '../contexts/AuthContext';
import { UserProfile, WorkspaceSettings } from '../types';
import { 
  ShieldAlert, 
  UserCog, 
  Shield, 
  ShieldCheck,
  User, 
  Plus, 
  RefreshCw, 
  Search, 
  Trash2, 
  CheckCircle, 
  X, 
  Clock, 
  Globe, 
  Lock, 
  Unlock, 
  Save, 
  Users, 
  UserCheck, 
  UserX,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Settings,
  Flame
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
  const { profile, isAdmin, user, workspaceSettings, updateWorkspaceSettings } = useAuth();
  const isUserAdmin = Boolean(isAdmin || profile?.role === 'admin');

  // Realtime Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user' | 'active' | 'blocked'>('all');

  // Domain Restriction form state
  const [domainEnabled, setDomainEnabled] = useState(false);
  const [allowedDomain, setAllowedDomain] = useState('companyhero.com');
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [newExceptionEmail, setNewExceptionEmail] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Create User Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
  const [formError, setFormError] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initial settings from Context
  useEffect(() => {
    if (workspaceSettings) {
      setDomainEnabled(workspaceSettings.domainRestrictionEnabled || false);
      setAllowedDomain(workspaceSettings.allowedDomain || 'companyhero.com');
      setAllowedEmails(workspaceSettings.allowedEmails || []);
    }
  }, [workspaceSettings]);

  // Realtime listener for Firestore `users` collection
  useEffect(() => {
    if (!isUserAdmin) return;

    setLoading(true);
    const usersCol = collection(db, 'users');

    const unsubscribe = onSnapshot(usersCol, (snapshot) => {
      const userMap = new Map<string, UserProfile>();

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data) return;

        let email = data.email ? String(data.email).trim().toLowerCase() : '';
        if (!email && docSnap.id.includes('_') && (docSnap.id.includes('companyhero') || docSnap.id.includes('gmail') || docSnap.id.includes('com'))) {
          email = docSnap.id.replace(/_/g, '.').replace(/\.com(\.br)?/, (m: string) => '@' + m.slice(1));
        }

        if (!email || !email.includes('@')) return;
        const cleanEmail = email.toLowerCase().trim();
        const isSuper = isSuperAdmin(cleanEmail);
        const existing = userMap.get(cleanEmail);

        const resolvedRole: 'admin' | 'user' = isSuper ? 'admin' : (data.role === 'admin' || existing?.role === 'admin' ? 'admin' : 'user');
        const resolvedStatus: 'active' | 'blocked' = (data.status === 'blocked' || existing?.status === 'blocked') ? 'blocked' : 'active';

        // Extract domain
        const domain = cleanEmail.split('@')[1] || '';

        // Keep latest lastLoginAt
        let latestLogin = existing?.lastLoginAt || existing?.createdAt;
        const candidateLogin = data.lastLoginAt || data.lastLogin || data.createdAt;
        if (candidateLogin) {
          if (!latestLogin || new Date(candidateLogin).getTime() > new Date(latestLogin).getTime()) {
            latestLogin = candidateLogin;
          }
        }

        userMap.set(cleanEmail, {
          uid: docSnap.id,
          email: cleanEmail,
          displayName: data.displayName || existing?.displayName || cleanEmail.split('@')[0],
          photoURL: data.photoURL || existing?.photoURL || '',
          role: resolvedRole,
          status: resolvedStatus,
          domain: data.domain || domain,
          createdAt: existing?.createdAt || data.createdAt || new Date().toISOString(),
          lastLoginAt: latestLogin || new Date().toISOString()
        });
      });

      // Ensure current logged in user is represented
      if (user?.email) {
        const currentEmail = user.email.toLowerCase().trim();
        if (!userMap.has(currentEmail)) {
          userMap.set(currentEmail, {
            uid: user.uid,
            email: currentEmail,
            displayName: (user as any).displayName || currentEmail.split('@')[0],
            photoURL: (user as any).photoURL || '',
            role: 'admin',
            status: 'active',
            domain: currentEmail.split('@')[1] || '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          });
        }
      }

      // Sort by last login (most recent first)
      const sortedUsers = Array.from(userMap.values()).sort((a, b) => {
        const timeA = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
        const timeB = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
        return timeB - timeA;
      });

      setUsers(sortedUsers);
      localStorage.setItem('hero_users_cache', JSON.stringify(sortedUsers));
      setLoading(false);
    }, (error) => {
      console.warn("Realtime listener error:", error);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      showToast("Lista atualizada com o banco de dados!");
    } catch (e) {
      console.warn(e);
    } finally {
      setRefreshing(false);
    }
  };

  // Section 2: Save Domain Governance Settings
  const handleSaveDomainSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const cleanDomain = allowedDomain.trim().toLowerCase().replace(/^@/, '');
      await updateWorkspaceSettings({
        domainRestrictionEnabled: domainEnabled,
        allowedDomain: cleanDomain,
        allowedEmails: allowedEmails.map(email => email.toLowerCase().trim()),
        updatedAt: new Date().toISOString()
      });
      showToast("Políticas de domínio corporativo salvas com sucesso!");
    } catch (err) {
      console.warn("Could not save domain settings:", err);
      showToast("Erro ao salvar configurações de domínio.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddExceptionEmail = () => {
    const clean = newExceptionEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      showToast("Informe um e-mail válido para a lista de exceções.");
      return;
    }
    if (allowedEmails.includes(clean)) {
      showToast("Este e-mail já está na lista de exceções.");
      return;
    }
    setAllowedEmails([...allowedEmails, clean]);
    setNewExceptionEmail('');
  };

  const handleRemoveExceptionEmail = (emailToRemove: string) => {
    setAllowedEmails(allowedEmails.filter(e => e !== emailToRemove));
  };

  // Section 3: Admin Quick Actions
  const toggleRole = async (targetUser: UserProfile) => {
    // Safety lock: Cannot alter own role or super admin role
    if (user?.email?.toLowerCase().trim() === targetUser.email.toLowerCase().trim()) {
      showToast("Trava de segurança: Você não pode alterar sua própria permissão.");
      return;
    }
    if (isSuperAdmin(targetUser.email)) {
      showToast("Trava de segurança: O proprietário/super admin não pode ser rebaixado.");
      return;
    }

    const newRole: 'admin' | 'user' = targetUser.role === 'admin' ? 'user' : 'admin';
    const updated = users.map(u => u.email === targetUser.email ? { ...u, role: newRole } : u);
    setUsers(updated);

    try {
      await updateDoc(doc(db, 'users', targetUser.uid), { role: newRole });
      const altDocId = targetUser.email.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
      await setDoc(doc(db, 'users', altDocId), { role: newRole }, { merge: true }).catch(() => {});
      showToast(`Permissão de ${targetUser.email} alterada para ${newRole === 'admin' ? 'Administrador' : 'Usuário Padrão'}.`);
    } catch (err) {
      console.warn("Could not update user role in Firestore:", err);
      showToast("Aviso: Permissão salva localmente.");
    }
  };

  const toggleStatus = async (targetUser: UserProfile) => {
    // Safety lock: Cannot block own account
    if (user?.email?.toLowerCase().trim() === targetUser.email.toLowerCase().trim()) {
      showToast("Trava de segurança: Você não pode bloquear sua própria conta.");
      return;
    }
    if (isSuperAdmin(targetUser.email)) {
      showToast("Trava de segurança: O super admin não pode ser bloqueado.");
      return;
    }

    const newStatus: 'active' | 'blocked' = targetUser.status === 'active' ? 'blocked' : 'active';
    const updated = users.map(u => u.email === targetUser.email ? { ...u, status: newStatus } : u);
    setUsers(updated);

    try {
      await updateDoc(doc(db, 'users', targetUser.uid), { status: newStatus });
      const altDocId = targetUser.email.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
      await setDoc(doc(db, 'users', altDocId), { status: newStatus }, { merge: true }).catch(() => {});

      if (newStatus === 'blocked') {
        showToast(`Acesso de ${targetUser.email} bloqueado! Sua sessão será encerrada em tempo real.`);
      } else {
        showToast(`Acesso de ${targetUser.email} reativado com sucesso.`);
      }
    } catch (err) {
      console.warn("Could not update user status in Firestore:", err);
      showToast("Aviso: Status atualizado localmente.");
    }
  };

  const handleDeleteUser = async (targetUser: UserProfile) => {
    if (user?.email?.toLowerCase().trim() === targetUser.email.toLowerCase().trim()) {
      showToast("Trava de segurança: Você não pode excluir sua própria conta.");
      return;
    }
    if (isSuperAdmin(targetUser.email)) {
      showToast("Trava de segurança: A conta super admin não pode ser excluída.");
      return;
    }

    if (!window.confirm(`Tem certeza que deseja remover o usuário "${targetUser.email}" do sistema?`)) {
      return;
    }

    const updated = users.filter(u => u.email !== targetUser.email);
    setUsers(updated);

    try {
      await deleteDoc(doc(db, 'users', targetUser.uid));
      const altDocId = targetUser.email.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
      await deleteDoc(doc(db, 'users', altDocId)).catch(() => {});
      showToast(`Usuário ${targetUser.email} removido.`);
    } catch (err) {
      console.warn("Could not delete user in Firestore:", err);
      showToast("Usuário removido da lista.");
    }
  };

  // Create User Handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const cleanEmail = newUserEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setFormError("Informe um endereço de e-mail corporativo válido.");
      return;
    }

    setSavingUser(true);
    const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
    const domain = cleanEmail.split('@')[1] || '';

    const newProfile: UserProfile = {
      uid: docId,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      photoURL: '',
      role: newUserRole,
      status: 'active',
      domain,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    const updatedList = existingIndex >= 0 
      ? users.map((u, i) => i === existingIndex ? { ...u, ...newProfile } : u)
      : [newProfile, ...users];

    setUsers(updatedList);
    localStorage.setItem('hero_users_cache', JSON.stringify(updatedList));

    try {
      const userRef = doc(db, 'users', docId);
      await setDoc(userRef, newProfile, { merge: true });
      showToast(`Usuário ${cleanEmail} cadastrado com sucesso!`);
      setIsModalOpen(false);
      setNewUserEmail('');
      setNewUserRole('user');
    } catch (err) {
      console.warn(err);
      showToast(`Usuário ${cleanEmail} cadastrado localmente.`);
      setIsModalOpen(false);
      setNewUserEmail('');
      setNewUserRole('user');
    } finally {
      setSavingUser(false);
    }
  };

  if (!isUserAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[65vh]">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Restrito</h2>
        <p className="text-slate-500 max-w-md text-sm">
          Você não tem permissão de Administrador para acessar o painel de Gestão de Pessoas e Usuários.
        </p>
      </div>
    );
  }

  // Filter users by search and role/status
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      u.email.toLowerCase().includes(q) || 
      u.displayName.toLowerCase().includes(q) ||
      u.domain?.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (roleFilter === 'admin') return u.role === 'admin';
    if (roleFilter === 'user') return u.role === 'user';
    if (roleFilter === 'active') return u.status === 'active';
    if (roleFilter === 'blocked') return u.status === 'blocked';
    return true;
  });

  // Calculate stats
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalActive = users.filter(u => u.status === 'active').length;
  const totalBlocked = users.filter(u => u.status === 'blocked').length;
  const totalOnline = users.filter(u => formatLastLogin(u.lastLoginAt).isOnline).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Gestão de Pessoas & Acessos</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sincronização em Tempo Real
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Controle permissões RBAC, governe restrições de domínio corporativo e acompanhe acessos em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-60"
            title="Sincronizar dados com Firestore"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin text-slate-400" : "text-slate-600"} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#FF0066] hover:bg-[#E6005C] rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Cadastrar Usuário</span>
          </button>
        </div>
      </div>

      {/* 1. SEÇÃO DE INDICADORES DE GESTÃO (CARDS DE ESTATÍSTICAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total de Usuários</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalUsers}</h3>
            <span className="text-[11px] text-slate-400">Cadastrados no sistema</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-purple-700">Administradores</p>
            <h3 className="text-2xl font-extrabold text-purple-900 mt-0.5">{totalAdmins}</h3>
            <span className="text-[11px] text-purple-600">Acesso total às diretrizes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">Usuários Ativos</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h3 className="text-2xl font-extrabold text-emerald-900">{totalActive}</h3>
              {totalOnline > 0 && (
                <span className="text-xs font-semibold text-emerald-600">({totalOnline} online agora)</span>
              )}
            </div>
            <span className="text-[11px] text-emerald-600">Sessões liberadas</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            totalBlocked > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'
          }`}>
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Bloqueados</p>
            <h3 className={`text-2xl font-extrabold mt-0.5 ${totalBlocked > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {totalBlocked}
            </h3>
            <span className="text-[11px] text-slate-400">Acesso negado em tempo real</span>
          </div>
        </div>
      </div>

      {/* 2. CONFIGURAÇÕES DE DOMÍNIO CORPORATIVO & EXCEÇÕES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#FF0066] flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Governança de Domínio Corporativo & Whitelist</h2>
                <p className="text-xs text-slate-500">
                  Restrinja acessos Google exclusivamente ao domínio da sua empresa com exceções autorizadas.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-700">
                {domainEnabled ? 'Restrição Ativada' : 'Restrição Desativada'}
              </span>
              <button
                type="button"
                onClick={() => setDomainEnabled(!domainEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  domainEnabled ? 'bg-[#FF0066]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    domainEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveDomainSettings} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domínio Principal */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Domínio Corporativo Principal
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={allowedDomain}
                  onChange={(e) => setAllowedDomain(e.target.value)}
                  placeholder="companyhero.com"
                  className="w-full pl-8 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] font-medium text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Colaboradores com e-mail deste domínio terão login Google liberado automaticamente.
              </p>
            </div>

            {/* Inclusão de Exceção */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Adicionar Exceção Individual (Whitelist)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newExceptionEmail}
                  onChange={(e) => setNewExceptionEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExceptionEmail();
                    }
                  }}
                  placeholder="ex: parceiro@externo.com ou gmail"
                  className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066]"
                />
                <button
                  type="button"
                  onClick={handleAddExceptionEmail}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Adicionar</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Para consultores, parceiros externos ou contas pessoais autorizadas.
              </p>
            </div>
          </div>

          {/* Chips de Exceções */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              E-mails de Exceção Autorizados ({allowedEmails.length})
            </label>
            {allowedEmails.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum e-mail externo cadastrado na whitelist.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allowedEmails.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-medium border border-slate-200"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExceptionEmail(email)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-0.5 rounded cursor-pointer"
                      title={`Remover ${email}`}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botão de Salvar Configurações */}
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={savingSettings}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {savingSettings ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando Políticas...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Salvar Políticas de Domínio</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. TABELA DE USUÁRIOS COM AÇÕES EM TEMPO REAL */}
      <div className="space-y-4">
        {/* Barra de Busca e Filtros */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por nome, e-mail ou domínio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066]"
            />
          </div>

          {/* Filtro por Função / Status */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl">
            {(['all', 'admin', 'user', 'active', 'blocked'] as const).map((mode) => {
              const labels = {
                all: 'Todos',
                admin: 'Admins',
                user: 'Usuários',
                active: 'Ativos',
                blocked: 'Bloqueados'
              };
              return (
                <button
                  key={mode}
                  onClick={() => setRoleFilter(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    roleFilter === mode
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center flex flex-col justify-center items-center">
              <div className="w-8 h-8 border-4 border-[#FF0066] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-slate-600">Sincronizando usuários em tempo real...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Avatar & Colaborador</th>
                    <th scope="col" className="px-6 py-4">Domínio</th>
                    <th scope="col" className="px-6 py-4">Cargo / Função</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Último Acesso</th>
                    <th scope="col" className="px-6 py-4 text-right">Ações de Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((item) => {
                    const isCurrent = user?.email?.toLowerCase().trim() === item.email?.toLowerCase().trim();
                    const isTargetSuper = isSuperAdmin(item.email);
                    const access = formatLastLogin(item.lastLoginAt);

                    return (
                      <tr key={item.email} className={`hover:bg-slate-50/80 transition-colors ${item.status === 'blocked' ? 'bg-red-50/30' : ''}`}>
                        {/* Avatar & Nome */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.photoURL ? (
                              <img 
                                src={item.photoURL} 
                                alt={item.displayName} 
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                item.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {item.displayName ? item.displayName.charAt(0).toUpperCase() : item.email.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900 truncate">
                                  {item.displayName || item.email.split('@')[0]}
                                </p>
                                {isCurrent && (
                                  <span className="text-[10px] font-bold uppercase bg-pink-100 text-[#FF0066] px-1.5 py-0.5 rounded">
                                    Você
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 truncate">{item.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Domínio */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                            @{item.domain || item.email.split('@')[1]}
                          </span>
                        </td>

                        {/* Cargo / Função */}
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

                        {/* Status (Ativo / Bloqueado) */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(item)}
                            disabled={isCurrent || isTargetSuper}
                            title={isCurrent ? "Você não pode alterar seu próprio status" : "Clique para alternar status"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-transform active:scale-95 ${
                              isCurrent || isTargetSuper ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                            } ${
                              item.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {item.status === 'active' ? 'Ativo' : 'Bloqueado'}
                          </button>
                        </td>

                        {/* Último Acesso */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              access.isOnline ? 'bg-emerald-500 animate-ping' : item.lastLoginAt ? 'bg-slate-300' : 'bg-amber-400'
                            }`}></span>
                            <span className={`text-xs font-medium ${access.isOnline ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}>
                              {access.text}
                            </span>
                          </div>
                        </td>

                        {/* Ações Rápidas */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Tornar Admin / Usuário */}
                            <button
                              onClick={() => toggleRole(item)}
                              disabled={isCurrent || isTargetSuper}
                              title={
                                isCurrent 
                                  ? "Você não pode alterar seu próprio papel" 
                                  : isTargetSuper 
                                    ? "Super admin protegido" 
                                    : (item.role === 'admin' ? 'Tornar Usuário Padrão' : 'Conceder Acesso Admin')
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                                isCurrent || isTargetSuper
                                  ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                                  : item.role === 'admin' 
                                    ? 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50 cursor-pointer' 
                                    : 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100 cursor-pointer'
                              }`}
                            >
                              <UserCog size={13} />
                              <span>{item.role === 'admin' ? 'Tornar Usuário' : 'Tornar Admin'}</span>
                            </button>

                            {/* Bloquear / Desbloquear */}
                            <button
                              onClick={() => toggleStatus(item)}
                              disabled={isCurrent || isTargetSuper}
                              title={item.status === 'active' ? "Bloquear acesso" : "Desbloquear acesso"}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isCurrent || isTargetSuper
                                  ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                                  : item.status === 'active'
                                    ? 'border-red-200 text-red-600 hover:bg-red-50 cursor-pointer'
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                              }`}
                            >
                              {item.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                            </button>

                            {/* Excluir */}
                            {!isCurrent && !isTargetSuper && (
                              <button
                                onClick={() => handleDeleteUser(item)}
                                title="Remover usuário"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
                            <User size={24} />
                          </div>
                          <p className="text-base font-semibold text-slate-800 mb-1">
                            {searchQuery ? "Nenhum resultado encontrado" : "Nenhum usuário cadastrado"}
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            {searchQuery 
                              ? `Nenhum usuário corresponde ao filtro "${searchQuery}".` 
                              : "Cadastre um novo colaborador ou aguarde o primeiro login corporativo via Google."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 4. QUADRO COMPARATIVO DE ACESSOS (USER vs ADMIN) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Quadro Comparativo de Privilégios & Matriz de Acessos</h2>
            <p className="text-xs text-slate-500">Entenda os limites de atuação de cada perfil de acesso na plataforma.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Usuário Padrão */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <h3 className="font-bold text-slate-900 text-sm">Perfil: Usuário Padrão (Colaborador)</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Acesso integral a todos os <strong>Módulos de Capacitação & Treinamento</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Visualização de <strong>Playbooks, Scripts de Atendimento e Vendas</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Consulta a <strong>Perguntas Frequentes (FAQ)</strong> e respostas rápidas</span>
              </li>
              <li className="flex items-start gap-2">
                <X size={15} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Sem acesso à tabela de Gestão de Usuários</span>
              </li>
              <li className="flex items-start gap-2">
                <X size={15} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Sem permissão para alterar regras de domínio ou status</span>
              </li>
            </ul>
          </div>

          {/* Card Administrador */}
          <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <h3 className="font-bold text-purple-950 text-sm">Perfil: Administrador (Gestão Total)</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-purple-950">
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-purple-600 shrink-0 mt-0.5" />
                <span><strong>Todos os privilégios</strong> do Usuário Padrão liberados</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Painel dedicado de <strong>Gestão de Pessoas & Usuários</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Atribuição e revogação de funções (<strong>Admin vs Usuário</strong>)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-purple-600 shrink-0 mt-0.5" />
                <span><strong>Bloqueio em tempo real</strong> (desconecta a sessão do colaborador na hora)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={15} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Governança de <strong>Domínio Corporativo</strong> e gestão de Whitelist de exceções</span>
              </li>
            </ul>
          </div>
        </div>
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
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
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
                  O colaborador poderá fazer login via Google com este e-mail.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5 tracking-wider">
                  Nível de Permissão Inicial
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF0066]/20 focus:border-[#FF0066] transition-all text-slate-800"
                >
                  <option value="user">Usuário Padrão (Acesso a Cursos e Conteúdos)</option>
                  <option value="admin">Administrador (Gestão de Usuários & Políticas)</option>
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
                    <span>Cadastrar Usuário</span>
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
