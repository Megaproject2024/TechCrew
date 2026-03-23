export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Location {
  lat: number;
  lng: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: Location;
  totalBeds: number;
  availableBeds: number;
  currentLoad: number; // Percentage 0-100
  specialties: string[];
}

export interface PatientEmergency {
  id: string;
  patientName: string;
  age: number;
  severity: Severity;
  condition: string;
  location: Location;
  timestamp: string;
  recommendedHospitalId?: string;
}

export interface RouteMetrics {
  distance: string; // e.g., "5.2 km"
  duration: string; // e.g., "12 mins"
  trafficLevel: 'LOW' | 'MODERATE' | 'HEAVY';
}

export interface RoutingRecommendation {
  hospitalId: string;
  metrics: RouteMetrics;
  score: number; // AI score 0-100 indicating suitability
  reasoning: string;
}
