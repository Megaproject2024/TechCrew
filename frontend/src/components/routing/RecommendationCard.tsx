import React from 'react';
import type { Hospital, PatientEmergency } from '../../types';

interface RecommendationCardProps {
  emergency: PatientEmergency;
  recommendedHospital: Hospital;
  onDispatch: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ emergency, recommendedHospital, onDispatch }) => {
  return (
    <div className="absolute top-4 right-4 w-96 bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden z-[1000] animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <h2 className="font-bold text-lg">AI Routing Suggestion</h2>
        </div>
        <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
          Optimal Match
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Target Healthcare Facility</p>
          <h3 className="text-xl font-bold text-slate-800">{recommendedHospital.name}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">ETA</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">12</span>
              <span className="text-sm text-slate-600 font-medium">mins</span>
            </div>
            <span className="text-xs text-green-600 font-medium mt-1 inline-block">Low Traffic</span>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">Facility Load</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${recommendedHospital.currentLoad > 90 ? 'text-red-600' : 'text-slate-800'}`}>
                {recommendedHospital.currentLoad}%
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium mt-1 inline-block">
              {recommendedHospital.availableBeds} beds available
            </span>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl">
          <span className="block text-xs text-blue-800 font-semibold mb-2">Why this facility?</span>
          <ul className="text-sm text-blue-900 space-y-2">
            <li className="flex gap-2">
              <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Closest facility equipped for <strong>{emergency.severity}</strong> severity conditions.</span>
            </li>
            <li className="flex gap-2">
              <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Matches required specialty for patient condition.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
        <button className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          Manual Override
        </button>
        <button 
          onClick={onDispatch}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
        >
          Dispatch Route
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
