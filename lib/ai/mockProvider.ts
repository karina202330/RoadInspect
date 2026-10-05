import { AIAnalysisProgress, AIProvider, InspectionAnalysisResult } from './provider';
import { Defect, DefectSeverity, DefectType, MaintenanceRecommendation } from '@/types';
import { INITIAL_DEFECTS } from '@/lib/mock/data';

export class MockAIProvider implements AIProvider {
  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async analyzeImage(
    imageUrl: string,
    options: { sensitivity?: 'low' | 'standard' | 'high' } = {}
  ): Promise<Defect[]> {
    await this.wait(1200);

    const sensitivity = options.sensitivity || 'standard';
    let baseDefects = [...INITIAL_DEFECTS];

    if (sensitivity === 'low') {
      baseDefects = baseDefects.filter((d) => d.severity === 'critical' || d.severity === 'high');
    }

    return baseDefects.map((d, index) => ({
      ...d,
      id: `DF-SIM-${Date.now()}-${index}`,
      imageUrl,
      detectedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }));
  }

  async runFullInspectionPipeline(
    inspectionId: string,
    images: { url: string; name: string }[],
    options: {
      sensitivity?: 'low' | 'standard' | 'high';
      defectTypes?: DefectType[];
      onProgress?: (progress: AIAnalysisProgress) => void;
    }
  ): Promise<InspectionAnalysisResult> {
    const notify = (progress: AIAnalysisProgress) => {
      if (options.onProgress) {
        options.onProgress(progress);
      }
    };

    const totalImages = Math.max(images.length, 1);

    // Stage 1: Uploading & Frame Ingestion
    notify({
      stage: 'uploading',
      progressPercent: 15,
      message: `Ingesting ${totalImages} high-resolution frames & calibrating telemetry...`,
      currentFrame: 1,
      totalFrames: totalImages,
    });
    await this.wait(700);

    // Stage 2: Preprocessing & Contrast Normalization
    notify({
      stage: 'preprocessing',
      progressPercent: 32,
      message: 'Applying lens rectification, glare reduction and asphalt contrast enhancement...',
      currentFrame: Math.ceil(totalImages * 0.4),
      totalFrames: totalImages,
    });
    await this.wait(800);

    // Stage 3: Object Detection
    notify({
      stage: 'detection',
      progressPercent: 55,
      message: 'Running YOLO-v11x inference across roadway surfaces and shoulder corridors...',
      currentFrame: Math.ceil(totalImages * 0.75),
      totalFrames: totalImages,
    });
    await this.wait(900);

    // Stage 4: Defect Classification
    notify({
      stage: 'classification',
      progressPercent: 74,
      message: 'Classifying pavement distress phenotypes (potholes, longitudinal/transverse fractures)...',
      currentFrame: totalImages,
      totalFrames: totalImages,
    });
    await this.wait(750);

    // Stage 5: Severity & Structural Assessment
    notify({
      stage: 'severity',
      progressPercent: 88,
      message: 'Computing pavement condition index (PCI) impact and safety severity ranking...',
      currentFrame: totalImages,
      totalFrames: totalImages,
    });
    await this.wait(650);

    // Stage 6: Generating Recommendations
    notify({
      stage: 'recommendations',
      progressPercent: 96,
      message: 'Formulating automated maintenance work orders and emergency dispatch alerts...',
      currentFrame: totalImages,
      totalFrames: totalImages,
    });
    await this.wait(500);

    // Stage 7: Complete
    notify({
      stage: 'completed',
      progressPercent: 100,
      message: 'Inspection analysis completed successfully. Results ready for engineer verification.',
      currentFrame: totalImages,
      totalFrames: totalImages,
    });

    // Generate defects
    const generatedDefects: Defect[] = INITIAL_DEFECTS.map((defect, idx) => ({
      ...defect,
      id: `DF-${inspectionId.replace('RV-', '')}-${300 + idx}`,
      inspectionId,
      detectedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      imageUrl: images[0]?.url || defect.imageUrl,
    }));

    const criticalCount = generatedDefects.filter((d) => d.severity === 'critical').length;
    const highCount = generatedDefects.filter((d) => d.severity === 'high').length;
    const mediumCount = generatedDefects.filter((d) => d.severity === 'medium').length;
    const lowCount = generatedDefects.filter((d) => d.severity === 'low').length;

    const healthScore = Math.max(45, 100 - (criticalCount * 4 + highCount * 2 + mediumCount * 1));

    const recommendations = generatedDefects
      .filter((d) => d.severity === 'critical' || d.severity === 'high')
      .map((d) => this.generateRecommendation(d));

    return {
      inspectionId,
      healthScore,
      defectCount: generatedDefects.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      defects: generatedDefects,
      recommendations,
      summary: this.generateInspectionSummary(generatedDefects, healthScore),
    };
  }

  classifySeverity(defectType: DefectType, confidence: number, dimensions?: string): DefectSeverity {
    if (defectType === 'pothole' || defectType === 'alligator_crack') {
      return confidence > 0.85 ? 'critical' : 'high';
    }
    if (defectType === 'road_edge_damage' || defectType === 'transverse_crack') {
      return 'high';
    }
    if (defectType === 'longitudinal_crack' || defectType === 'debris') {
      return 'medium';
    }
    return 'low';
  }

  generateRecommendation(defect: Defect): MaintenanceRecommendation {
    let priority: 'critical' | 'high' | 'medium' = 'medium';
    let urgency = 'Routine (14 days)';
    let cost = '₹12,000';
    let action = 'Seal and monitor during routine inspection cycles.';

    if (defect.severity === 'critical') {
      priority = 'critical';
      urgency = 'Immediate (24-48 hrs)';
      cost = '₹45,000';
      action = 'Emergency box-cut milling, aggregate re-compaction and VG-30 bituminous hot mix fill.';
    } else if (defect.severity === 'high') {
      priority = 'high';
      urgency = 'Priority (7 days)';
      cost = '₹25,000';
      action = 'Polymer-modified bitumen injection and edge berm reinforcement.';
    }

    return {
      id: `REC-${defect.id}`,
      defectId: defect.id,
      priority,
      title: `${defect.title} Remediation`,
      issue: `Observed at ${defect.chainage} in ${defect.location}.`,
      evidence: `AI detected with ${(defect.confidence * 100).toFixed(1)}% confidence. ${defect.dimensions || ''}`,
      recommendedAction: action,
      urgency,
      status: 'pending',
      assignedAgency: defect.assignedTo,
      estimatedCost: cost,
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      chainage: defect.chainage,
    };
  }

  generateInspectionSummary(defects: Defect[], healthScore: number): string {
    const critical = defects.filter((d) => d.severity === 'critical').length;
    return `AI Vision analysis completed. Overall road health assessed at ${healthScore}/100. Identified ${defects.length} distress anomalies including ${critical} critical structural hazards requiring immediate highway authority intervention.`;
  }
}

export const aiProvider = new MockAIProvider();
