import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { UserManagement } from './pages/UserManagement';
import HeroAcademyApp from './HeroAcademyApp';

const App = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');

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
      {activeTab === 'dashboard' ? (
        <HeroAcademyApp />
      ) : (
        <UserManagement />
      )}
    </DashboardLayout>
  );
};

export default App;
