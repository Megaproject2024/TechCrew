import type { Hospital, PatientEmergency } from '../types';

export const mockHospitals: Hospital[] = [
  {
    id: 'h-1',
    name: 'KEM Hospital, Parel',
    location: { lat: 19.0170, lng: 72.8300 },
    totalBeds: 500,
    availableBeds: 45,
    currentLoad: 91,
    specialties: ['Trauma', 'Cardiology', 'Neurology'],
  },
  {
    id: 'h-2',
    name: 'Hinduja Hospital',
    location: { lat: 19.0300, lng: 72.8500 },
    totalBeds: 250,
    availableBeds: 80,
    currentLoad: 68,
    specialties: ['Pediatrics', 'Orthopedics'],
  },
  {
    id: 'h-3',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    location: { lat: 19.1170, lng: 72.8800 },
    totalBeds: 350,
    availableBeds: 12,
    currentLoad: 96,
    specialties: ['Burns', 'Trauma', 'Oncology'],
  },
  {
    id: 'h-4',
    name: 'Fortis Hospital, Mulund',
    location: { lat: 19.1500, lng: 72.9500 },
    totalBeds: 150,
    availableBeds: 50,
    currentLoad: 66,
    specialties: ['General Practice', 'Maternity'],
  }
];

export const mockEmergencies: PatientEmergency[] = [
  {
    id: 'e-101',
    patientName: 'Rajesh Kumar',
    age: 45,
    severity: 'CRITICAL',
    condition: 'Severe chest pain, suspected heart attack',
    location: { lat: 19.0200, lng: 72.8400 },
    timestamp: new Date().toISOString(),
    recommendedHospitalId: 'h-1' // AI recommends KEM
  },
  {
    id: 'e-102',
    patientName: 'Priya Sharma',
    age: 28,
    severity: 'HIGH',
    condition: 'Multiple fractures from traffic accident',
    location: { lat: 19.0500, lng: 72.8600 },
    timestamp: new Date().toISOString(),
  },
  {
    id: 'e-103',
    patientName: 'Aarav Desai',
    age: 1,
    severity: 'MEDIUM',
    condition: 'High fever and dehydration',
    location: { lat: 19.1000, lng: 72.8700 },
    timestamp: new Date().toISOString(),
  }
];
