import { Defect, DefectSeverity, DefectType, InspectionImage, MaintenanceRecommendation } from '@/types';

export interface AIAnalysisProgress {
  stage: 'uploading' | 'preprocessing' | 'detection' | 'classification' | 'severity' | 'recommendations' | 'completed';
  progressPercent: number;
  message: string;
  currentFrame?: number;
  totalFrames?: number;
}

export interface InspectionAnalysisResult {
  inspectionId: string;
  healthScore: number;
  defectCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  defects: Defect[];
  recommendations: MaintenanceRecommendation[];
  summary: string;
}

export interface AIProvider {
  analyzeImage(
    imageUrl: string,
    options?: { sensitivity?: 'low' | 'standard' | 'high' }
  ): Promise<Defect[]>;

  runFullInspectionPipeline(
    inspectionId: string,
    images: { url: string; name: string }[],
    options: {
      sensitivity?: 'low' | 'standard' | 'high';
      defectTypes?: DefectType[];
      onProgress?: (progress: AIAnalysisProgress) => void;
    }
  ): Promise<InspectionAnalysisResult>;

  classifySeverity(defectType: DefectType, confidence: number, dimensions?: string): DefectSeverity;

  generateRecommendation(defect: Defect): MaintenanceRecommendation;

  generateInspectionSummary(defects: Defect[], healthScore: number): string;
}
