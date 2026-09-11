import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { UserManagement } from './pages/UserManagement';
import HeroAcademyApp from './HeroAcademyApp';

const App = () => {
  const { user, profile, loading, isAdmin } = useAuth();
  const isUserAdmin = Boolean(isAdmin || profile?.role === 'admin');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');

  // Strict RBAC protection: force standard users to dashboard
  useEffect(() => {
    if (!isUserAdmin && activeTab === 'users') {
      setActiveTab('dashboard');
    }
  }, [isUserAdmin, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#FF0066] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'users' && isUserAdmin ? (
        <UserManagement />
      ) : (
        <HeroAcademyApp />
      )}
    </DashboardLayout>
  );
};

export default App;
