import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { mockEmergencies } from '../../data/mockData';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string | undefined>();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          emergencies={mockEmergencies} 
          selectedId={selectedEmergencyId}
          onSelectEmergency={setSelectedEmergencyId}
        />
        <main className="flex-1 relative overflow-hidden">
          {/* Main content area (e.g., Live Map) goes here */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
