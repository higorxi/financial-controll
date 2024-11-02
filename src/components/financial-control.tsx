'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, X, Calendar, FileText, Star, Settings, User, DollarSign } from 'lucide-react';
import { initialUser, UserType } from '@/mock/initialUser';
import { ProfileSection } from './profile-section';
import { SettingsSection } from './settings-section';
import { ReportsSection } from './reports-section';
import { LaunchesSection } from './launches-section';

type SectionType = 'Lançamentos' | 'Relatórios' | 'Configurações' | 'Perfil';

// Tailwind color palette constants
const colors = {
  primary: {
    light: 'bg-teal-50',    // Background
    main: 'bg-teal-800',    // Sidebar (both states)
    text: 'text-teal-900',  // Text
    hover: 'hover:bg-teal-700',
    active: 'bg-teal-100',
  }
};

// Reusable style constants
const styles = {
  sidebar: {
    base: 'text-white p-4 flex flex-col transition-all duration-300 ease-in-out',
    expanded: 'w-64',
    collapsed: 'w-20',
  },
  sidebarButton: {
    base: 'w-full py-2 text-white transition-colors duration-200',
    expanded: 'justify-start',
    collapsed: 'justify-center',
  },
  icon: {
    base: 'h-5 w-5',
    large: 'h-8 w-8',
    small: 'h-4 w-4',
  },
};

export default function FinancialControl() {
  const [user, setUser] = useState<UserType>(initialUser);
  const [transactions, setTransactions] = useState([]);
  const [activeSection, setActiveSection] = useState<SectionType>('Lançamentos');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const updateBalance = (type: 'income' | 'expense', amount: number) => {
    setUser((prev) => ({
      ...prev,
      balance: type === 'income' ? prev.balance + amount : prev.balance - amount,
    }));
  };

  const addTransaction = (newTransaction: any) => {
    setTransactions([...transactions, newTransaction]);
    updateBalance(newTransaction.type, newTransaction.amount);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Lançamentos':
        return <LaunchesSection addTransaction={addTransaction} user={user} />;
      case 'Relatórios':
        return <ReportsSection transactions={transactions} />;
      case 'Configurações':
        return <SettingsSection user={user} setUser={setUser} />;
      case 'Perfil':
        return <ProfileSection user={user} />;
      default:
        return null;
    }
  };

  const sections = [
    { name: 'Lançamentos', icon: <Calendar className={styles.icon.base} /> },
    { name: 'Relatórios', icon: <FileText className={styles.icon.base} /> },
    { name: 'Lista de Desejo', icon: <Star className={styles.icon.base} /> },
    { name: 'Metas e Planos', icon: <Star className={styles.icon.base} /> },
    { name: 'Configurações', icon: <Settings className={styles.icon.base} /> },
    { name: 'Perfil', icon: <User className={styles.icon.base} /> },
  ];

  const formatTime = (date: Date) => ({
    hours: String(date.getHours()).padStart(2, '0'),
    minutes: String(date.getMinutes()).padStart(2, '0'),
  });

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderClock = () => {
    if (!currentDateTime) return <p>Carregando...</p>;

    const { hours, minutes } = formatTime(currentDateTime);
    
    if (!isSidebarOpen) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-sm font-bold">
            {hours}:{minutes}
          </div>
        </div>
      );
    }

    return (
      <div>
        <p className="text-sm font-medium text-left">
          {formatDate(currentDateTime)}
        </p>
        <div className="text-2xl font-bold text-left flex">
          <span>{hours}</span>
          <span>:</span>
          <span>{minutes}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-teal-50">
      <aside
        className={`${
          isSidebarOpen ? styles.sidebar.expanded : styles.sidebar.collapsed
        } ${styles.sidebar.base} ${colors.primary.main}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center ${isSidebarOpen ? '' : 'justify-center w-full'}`}>
            <DollarSign className={`${styles.icon.large} text-white`} />
            {isSidebarOpen && <span className="text-2xl font-bold text-white">FinControl</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-teal-100"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? (
              <X className={styles.icon.small} />
            ) : (
              <Menu className={styles.icon.small} />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          {sections.map(({ name, icon }) => (
            <Button
              key={name}
              variant={activeSection === name ? 'secondary' : 'ghost'}
              className={`
                ${styles.sidebarButton.base}
                ${isSidebarOpen ? styles.sidebarButton.expanded : styles.sidebarButton.collapsed}
                ${activeSection === name 
                  ? `${colors.primary.active} text-teal-900` 
                  : `text-white ${colors.primary.hover}`}
              `}
              onClick={() => setActiveSection(name as SectionType)}
            >
              {React.cloneElement(icon, {
                className: `${styles.icon.base} ${
                  activeSection === name ? 'text-teal-900' : 'text-white'
                }`
              })}
              {isSidebarOpen && (
                <span className={`ml-2 ${
                  activeSection === name ? 'text-teal-900' : 'text-white'
                }`}>
                  {name}
                </span>
              )}
            </Button>
          ))}
        </nav>

        {/* Clock Card */}
        <Card className="mt-auto mb-8 bg-white">
          <CardContent className="p-4 flex flex-col items-center">
            {renderClock()}
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-teal-50">
        <h1 className="text-3xl font-bold mb-6 capitalize text-teal-900">
          {activeSection}
        </h1>
        {renderSection()}
      </main>
    </div>
  );
}