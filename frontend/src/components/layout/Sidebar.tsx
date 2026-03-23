import React from 'react';
import type { PatientEmergency } from '../../types';

interface SidebarProps {
  emergencies: PatientEmergency[];
  selectedId?: string;
  onSelectEmergency: (id: string) => void;
}

const severityColors = {
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};

const Sidebar: React.FC<SidebarProps> = ({ emergencies, selectedId, onSelectEmergency }) => {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm z-10 relative">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800">Active Emergencies</h2>
        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-full">
          {emergencies.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {emergencies.map((e) => (
          <div 
            key={e.id}
            onClick={() => onSelectEmergency(e.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
              selectedId === e.id 
                ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-400' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900">{e.patientName}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${severityColors[e.severity]}`}>
                {e.severity}
              </span>
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {e.condition}
            </p>
            
            <div className="flex items-center text-xs text-slate-500 gap-1 mt-auto">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {emergencies.length === 0 && (
          <div className="text-center text-slate-500 py-10">
            No active emergencies
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
