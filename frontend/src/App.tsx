import React, { useState } from 'react';

import LiveMap from './components/map/LiveMap';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import RecommendationCard from './components/routing/RecommendationCard';
import { mockHospitals, mockEmergencies } from './data/mockData';

function App() {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [dispatched, setDispatched] = useState<string[]>([]);

  const selectedEmergency = mockEmergencies.find(e => e.id === selectedId);
  const recommendedHospital = selectedEmergency?.recommendedHospitalId 
    ? mockHospitals.find(h => h.id === selectedEmergency.recommendedHospitalId) 
    : undefined;

  const handleDispatch = () => {
    if (selectedId && !dispatched.includes(selectedId)) {
      setDispatched([...dispatched, selectedId]);
      alert('Emergency Dispatched to ' + recommendedHospital?.name);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          emergencies={mockEmergencies.map(e => ({
            ...e,
            condition: dispatched.includes(e.id) ? `(DISPATCHED) ${e.condition}` : e.condition
          }))} 
          selectedId={selectedId}
          onSelectEmergency={setSelectedId}
        />
        <main className="flex-1 relative overflow-hidden">
          <LiveMap 
            hospitals={mockHospitals} 
            emergencies={mockEmergencies} 
            selectedEmergencyId={selectedId}
          />
          
          {selectedEmergency && recommendedHospital && !dispatched.includes(selectedId!) && (
            <RecommendationCard 
              emergency={selectedEmergency} 
              recommendedHospital={recommendedHospital}
              onDispatch={handleDispatch}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
