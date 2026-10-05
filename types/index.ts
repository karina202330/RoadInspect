export type DefectSeverity = 'critical' | 'high' | 'medium' | 'low';

export type DefectType =
  | 'pothole'
  | 'longitudinal_crack'
  | 'transverse_crack'
  | 'alligator_crack'
  | 'rutting'
  | 'road_edge_damage'
  | 'lane_marking_damage'
  | 'surface_degradation'
  | 'debris'
  | 'shoulder_damage';

export type DefectStatus =
  | 'new'
  | 'verified'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type InspectionStatus =
  | 'draft'
  | 'processing'
  | 'in_review'
  | 'completed'
  | 'archived';

export interface BoundingBox {
  x: number;      // normalized 0..1 (top-left x)
  y: number;      // normalized 0..1 (top-left y)
  width: number;  // normalized 0..1
  height: number; // normalized 0..1
}

export interface Defect {
  id: string;
  inspectionId: string;
  type: DefectType;
  title: string;
  severity: DefectSeverity;
  confidence: number;
  location: string;
  chainage: string;
  chainageMeters: number;
  status: DefectStatus;
  imageUrl: string;
  cropUrl?: string;
  boundingBox: BoundingBox;
  recommendation: string;
  urgency: string;
  estimatedCost: string;
  assignedTo: string;
  detectedAt: string;
  verifiedBy?: string;
  notes?: string;
  dimensions?: string;
  pavementIndexImpact: number;
}

export interface InspectionImage {
  id: string;
  inspectionId: string;
  url: string;
  name: string;
  chainage: string;
  chainageMeters: number;
  timestamp: string;
  gps: {
    lat: number;
    lng: number;
  };
  speed: string;
  lane: string;
  defects: Defect[];
}

export interface Inspection {
  id: string;
  projectName: string;
  roadName: string;
  segment: string;
  location: string;
  inspector: string;
  inspectorAvatar?: string;
  date: string;
  status: InspectionStatus;
  healthScore: number;
  progress: number;
  imageCount: number;
  defectCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  images: InspectionImage[];
  notes?: string;
  sensitivity: 'low' | 'standard' | 'high';
  lastUpdated: string;
}

export interface RoadAsset {
  id: string;
  name: string;
  highway: string;
  segment: string;
  length: string;
  healthScore: number;
  lastInspection: string;
  openDefects: number;
  criticalDefects: number;
  status: 'healthy' | 'moderate' | 'degraded' | 'critical';
  surfaceCondition: number;
  safetyIndex: number;
  laneQuality: number;
  edgeCondition: number;
  trafficVolume: string;
  pavementType: string;
  jurisdiction: string;
  inspections: string[];
}

export interface MaintenanceRecommendation {
  id: string;
  defectId?: string;
  priority: 'critical' | 'high' | 'medium';
  title: string;
  issue: string;
  evidence: string;
  recommendedAction: string;
  urgency: string;
  status: 'pending' | 'scheduled' | 'dispatched' | 'completed';
  assignedAgency: string;
  estimatedCost: string;
  deadline: string;
  chainage: string;
}

export interface InspectionReport {
  id: string;
  inspectionId: string;
  projectName: string;
  roadName: string;
  segment: string;
  location: string;
  inspector: string;
  generatedAt: string;
  healthScore: number;
  surfaceCondition: number;
  structuralIntegrity: number;
  safetyIndex: number;
  maintenanceCostEstimate: string;
  totalDefects: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  status: 'final' | 'draft';
  executiveSummary: string;
  recommendations: MaintenanceRecommendation[];
  auditInfo: {
    systemVersion: string;
    modelChecksum: string;
    verifiedBy: string;
    verificationDate: string;
    certificationCode: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  link?: string;
}
