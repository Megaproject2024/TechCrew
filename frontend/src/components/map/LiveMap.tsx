import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hospital, PatientEmergency } from '../../types';

// Fix for default Leaflet icons in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const hospitalIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-white font-bold text-xs ring-4 ring-blue-600/20">H</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const emergencyIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse ring-4 ring-red-500/30"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

interface LiveMapProps {
  hospitals: Hospital[];
  emergencies: PatientEmergency[];
  selectedEmergencyId?: string;
}

// Component to recenter map when selected emergency changes
const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13, { animate: true });
  }, [lat, lng, map]);
  return null;
};

const LiveMap: React.FC<LiveMapProps> = ({ hospitals, emergencies, selectedEmergencyId }) => {
  const defaultCenter: [number, number] = [19.0760, 72.8777]; // Mumbai fallback
  
  const selectedEmergency = emergencies.find(e => e.id === selectedEmergencyId);

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {selectedEmergency && (
          <MapRecenter lat={selectedEmergency.location.lat} lng={selectedEmergency.location.lng} />
        )}

        {/* Render Hospitals */}
        {hospitals.map(hospital => (
          <Marker 
            key={hospital.id} 
            position={[hospital.location.lat, hospital.location.lng]}
            icon={hospitalIcon}
          >
            <Popup className="rounded-lg shadow-xl">
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-lg text-slate-800">{hospital.name}</h3>
                <div className="mt-2 text-sm text-slate-600">
                  <div className="flex justify-between py-1 border-b">
                    <span>Load</span>
                    <span className={`font-bold ${hospital.currentLoad > 90 ? 'text-red-600' : 'text-green-600'}`}>
                      {hospital.currentLoad}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span>Available Beds</span>
                    <span className="font-bold">{hospital.availableBeds} / {hospital.totalBeds}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wide">Specialties</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hospital.specialties.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Emergencies */}
        {emergencies.map(emergency => (
          <Marker 
            key={emergency.id} 
            position={[emergency.location.lat, emergency.location.lng]}
            icon={emergencyIcon}
          >
             <Popup className="rounded-lg shadow-xl">
              <div className="p-1">
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide border-red-200">
                  {emergency.severity}
                </span>
                <h3 className="font-bold text-slate-800 mt-1">{emergency.patientName}</h3>
                <p className="text-sm text-slate-600 mt-1">{emergency.condition}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Visualization */}
        {selectedEmergency && selectedEmergency.recommendedHospitalId && (
          <Polyline 
            positions={[
              [selectedEmergency.location.lat, selectedEmergency.location.lng],
              [hospitals.find(h => h.id === selectedEmergency.recommendedHospitalId)?.location.lat || 0,
               hospitals.find(h => h.id === selectedEmergency.recommendedHospitalId)?.location.lng || 0]
            ]}
            color="#3b82f6"
            weight={4}
            dashArray="10, 10"
            className="animate-pulse"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
