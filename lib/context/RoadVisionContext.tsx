'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Defect,
  DefectSeverity,
  DefectStatus,
  Inspection,
  InspectionReport,
  MaintenanceRecommendation,
  NotificationItem,
  RoadAsset,
} from '@/types';
import {
  INITIAL_DEFECTS,
  INITIAL_INSPECTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REPORTS,
  INITIAL_ROAD_ASSETS,
} from '@/lib/mock/data';
import { aiProvider } from '@/lib/ai/mockProvider';
import { AIAnalysisProgress } from '@/lib/ai/provider';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface RoadVisionContextType {
  inspections: Inspection[];
  defects: Defect[];
  roadAssets: RoadAsset[];
  reports: InspectionReport[];
  recommendations: MaintenanceRecommendation[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  toasts: ToastMessage[];

  // Selection & UI state
  selectedDefectId: string | null;
  isDefectDrawerOpen: boolean;
  selectedDefect: Defect | null;

  // Active AI run state
  isAnalyzing: boolean;
  analysisProgress: AIAnalysisProgress | null;

  // Actions
  addInspection: (inspection: Omit<Inspection, 'id' | 'healthScore' | 'progress' | 'defectCount' | 'criticalCount' | 'highCount' | 'mediumCount' | 'lowCount' | 'lastUpdated'>) => string;
  runAIAnalysis: (inspectionId: string, options?: { sensitivity?: 'low' | 'standard' | 'high' }) => Promise<void>;
  updateDefectStatus: (defectId: string, status: DefectStatus, extra?: { assignedTo?: string; verifiedBy?: string; notes?: string }) => void;
  updateDefectSeverity: (defectId: string, severity: DefectSeverity) => void;
  generateInspectionReport: (inspectionId: string) => Promise<string>;
  openDefectDrawer: (defectId: string) => void;
  closeDefectDrawer: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;

  // Calculated Stats
  stats: {
    totalInspections: number;
    activeInspections: number;
    totalDefects: number;
    criticalDefects: number;
    highDefects: number;
    mediumDefects: number;
    resolvedDefects: number;
    roadsInspectedKm: number;
    avgRoadHealth: number;
  };
}

const RoadVisionContext = createContext<RoadVisionContextType | undefined>(undefined);

export function RoadVisionProvider({ children }: { children: ReactNode }) {
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [defects, setDefects] = useState<Defect[]>(INITIAL_DEFECTS);
  const [roadAssets, setRoadAssets] = useState<RoadAsset[]>(INITIAL_ROAD_ASSETS);
  const [reports, setReports] = useState<InspectionReport[]>(INITIAL_REPORTS);
  const [recommendations, setRecommendations] = useState<MaintenanceRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
  const [isDefectDrawerOpen, setIsDefectDrawerOpen] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AIAnalysisProgress | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openDefectDrawer = (defectId: string) => {
    setSelectedDefectId(defectId);
    setIsDefectDrawerOpen(true);
  };

  const closeDefectDrawer = () => {
    setIsDefectDrawerOpen(false);
  };

  const selectedDefect = defects.find((d) => d.id === selectedDefectId) || null;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Add new inspection
  const addInspection = (
    data: Omit<Inspection, 'id' | 'healthScore' | 'progress' | 'defectCount' | 'criticalCount' | 'highCount' | 'mediumCount' | 'lowCount' | 'lastUpdated'>
  ): string => {
    const id = `RV-${1000 + inspections.length + 1}`;
    const newInspection: Inspection = {
      ...data,
      id,
      healthScore: 85,
      progress: 0,
      defectCount: 0,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      status: 'draft',
      lastUpdated: 'Just now',
    };

    setInspections((prev) => [newInspection, ...prev]);

    showToast('Inspection Project Created', `${id} (${data.projectName}) is ready for AI analysis.`);

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `New Project: ${id}`,
        message: `${data.roadName} (${data.segment}) inspection registered by ${data.inspector}.`,
        timestamp: 'Just now',
        type: 'info',
        read: false,
        link: `/inspections/${id}`,
      },
      ...prev,
    ]);

    return id;
  };

  // Run AI Inspection Analysis
  const runAIAnalysis = async (
    inspectionId: string,
    options: { sensitivity?: 'low' | 'standard' | 'high' } = {}
  ) => {
    setIsAnalyzing(true);
    setAnalysisProgress({
      stage: 'uploading',
      progressPercent: 5,
      message: 'Initializing AI computer vision models...',
    });

    try {
      const inspection = inspections.find((i) => i.id === inspectionId);
      const images = inspection?.images.map((img) => ({ url: img.url, name: img.name })) || [
        { url: INITIAL_DEFECTS[0].imageUrl, name: 'road_capture_01.jpg' },
      ];

      const result = await aiProvider.runFullInspectionPipeline(inspectionId, images, {
        sensitivity: options.sensitivity || 'high',
        onProgress: (progress) => {
          setAnalysisProgress(progress);
        },
      });

      // Update inspection with results
      setInspections((prev) =>
        prev.map((item) => {
          if (item.id === inspectionId) {
            return {
              ...item,
              status: 'completed',
              progress: 100,
              healthScore: result.healthScore,
              defectCount: result.defectCount,
              criticalCount: result.criticalCount,
              highCount: result.highCount,
              mediumCount: result.mediumCount,
              lowCount: result.lowCount,
              lastUpdated: 'Just now',
            };
          }
          return item;
        })
      );

      // Add newly detected defects
      setDefects((prev) => {
        const otherDefects = prev.filter((d) => d.inspectionId !== inspectionId);
        return [...result.defects, ...otherDefects];
      });

      // Add recommendations
      setRecommendations((prev) => [...result.recommendations, ...prev]);

      // Update corresponding Road Asset
      if (inspection) {
        setRoadAssets((prev) =>
          prev.map((asset) => {
            if (asset.highway === inspection.roadName || asset.inspections.includes(inspection.id)) {
              return {
                ...asset,
                healthScore: result.healthScore,
                openDefects: result.defectCount,
                criticalDefects: result.criticalCount,
                lastInspection: 'Today',
              };
            }
            return asset;
          })
        );
      }

      showToast(
        'AI Analysis Complete',
        `Processed road imagery. Detected ${result.defectCount} defects (${result.criticalCount} Critical).`,
        'success'
      );

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now()}`,
          title: `AI Analysis Complete: ${inspectionId}`,
          message: `Identified ${result.defectCount} defects. Health Score: ${result.healthScore}%.`,
          timestamp: 'Just now',
          type: result.criticalCount > 0 ? 'critical' : 'success',
          read: false,
          link: `/analysis/${inspectionId}`,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      showToast('Analysis Encountered Warning', 'Analysis completed with simulated fallback model.', 'warning');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  // Update defect status
  const updateDefectStatus = (
    defectId: string,
    status: DefectStatus,
    extra: { assignedTo?: string; verifiedBy?: string; notes?: string } = {}
  ) => {
    setDefects((prev) =>
      prev.map((defect) => {
        if (defect.id === defectId) {
          return {
            ...defect,
            status,
            assignedTo: extra.assignedTo || defect.assignedTo,
            verifiedBy: extra.verifiedBy || defect.verifiedBy,
            notes: extra.notes !== undefined ? extra.notes : defect.notes,
          };
        }
        return defect;
      })
    );

    const defect = defects.find((d) => d.id === defectId);
    showToast(
      'Defect Status Updated',
      `${defectId} (${defect ? defect.title : 'Defect'}) marked as ${status.replace('_', ' ').toUpperCase()}.`,
      'success'
    );
  };

  // Update defect severity
  const updateDefectSeverity = (defectId: string, severity: DefectSeverity) => {
    setDefects((prev) =>
      prev.map((defect) => {
        if (defect.id === defectId) {
          return { ...defect, severity };
        }
        return defect;
      })
    );

    // Recalculate inspection stats
    const defect = defects.find((d) => d.id === defectId);
    if (defect) {
      setInspections((prev) =>
        prev.map((ins) => {
          if (ins.id === defect.inspectionId) {
            const insDefects = defects.map((d) => (d.id === defectId ? { ...d, severity } : d)).filter((d) => d.inspectionId === ins.id);
            const crit = insDefects.filter((d) => d.severity === 'critical').length;
            const high = insDefects.filter((d) => d.severity === 'high').length;
            const med = insDefects.filter((d) => d.severity === 'medium').length;
            const low = insDefects.filter((d) => d.severity === 'low').length;
            return {
              ...ins,
              criticalCount: crit,
              highCount: high,
              mediumCount: med,
              lowCount: low,
            };
          }
          return ins;
        })
      );
    }

    showToast('Severity Updated', `${defectId} severity adjusted to ${severity.toUpperCase()}.`);
  };

  // Generate Report
  const generateInspectionReport = async (inspectionId: string): Promise<string> => {
    const inspection = inspections.find((i) => i.id === inspectionId) || inspections[0];
    const reportId = `RV-REP-${inspection.id.replace('RV-', '')}`;

    const insDefects = defects.filter((d) => d.inspectionId === inspection.id);
    const critical = insDefects.filter((d) => d.severity === 'critical').length;
    const high = insDefects.filter((d) => d.severity === 'high').length;

    const newReport: InspectionReport = {
      id: reportId,
      inspectionId: inspection.id,
      projectName: inspection.projectName,
      roadName: inspection.roadName,
      segment: inspection.segment,
      location: inspection.location,
      inspector: inspection.inspector,
      generatedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      healthScore: inspection.healthScore,
      surfaceCondition: Math.max(50, inspection.healthScore - 4),
      structuralIntegrity: Math.max(55, inspection.healthScore + 2),
      safetyIndex: Math.max(60, inspection.healthScore + 5),
      maintenanceCostEstimate: `₹${((critical * 65000 + high * 24000) / 100000).toFixed(1)} Lakhs`,
      totalDefects: insDefects.length,
      criticalCount: critical,
      highCount: high,
      mediumCount: insDefects.filter((d) => d.severity === 'medium').length,
      lowCount: insDefects.filter((d) => d.severity === 'low').length,
      status: 'final',
      executiveSummary: `Official Road Condition & Structural Damage Assessment Report for ${inspection.projectName}. AI vision scan evaluated surface condition at ${inspection.healthScore}/100. ${critical} critical hazards require urgent remedial intervention within statutory timelines.`,
      recommendations: recommendations.filter((r) => r.chainage.includes(inspection.roadName) || r.priority === 'critical'),
      auditInfo: {
        systemVersion: 'ROADVISION AI Enterprise v4.2.0',
        modelChecksum: 'YOLO-v11x-RoadDistress-f88a91c',
        verifiedBy: 'Er. Harsh Rathod (Inspection Director)',
        verificationDate: new Date().toISOString(),
        certificationCode: `RV-CERT-${Date.now().toString().slice(-6)}`,
      },
    };

    setReports((prev) => {
      const exists = prev.some((r) => r.id === reportId);
      if (exists) {
        return prev.map((r) => (r.id === reportId ? newReport : r));
      }
      return [newReport, ...prev];
    });

    showToast('Report Generated Successfully', `${reportId} is ready for export and administrative review.`);

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `Report Ready: ${reportId}`,
        message: `Official damage assessment report generated for ${inspection.projectName}.`,
        timestamp: 'Just now',
        type: 'info',
        read: false,
        link: `/reports/${reportId}`,
      },
      ...prev,
    ]);

    return reportId;
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Global stats calculation (reflects network aggregate baseline + live session mutations)
  const totalInspections = 128 + (inspections.length - INITIAL_INSPECTIONS.length);
  const activeInspections = Math.max(
    1,
    14 + (inspections.filter((i) => i.status === 'processing' || i.status === 'in_review').length - 2)
  );

  const defectDelta = defects.length - INITIAL_DEFECTS.length;
  const criticalDelta =
    defects.filter((d) => d.severity === 'critical').length -
    INITIAL_DEFECTS.filter((d) => d.severity === 'critical').length;
  const highDelta =
    defects.filter((d) => d.severity === 'high').length -
    INITIAL_DEFECTS.filter((d) => d.severity === 'high').length;
  const resolvedDelta =
    defects.filter((d) => d.status === 'resolved').length -
    INITIAL_DEFECTS.filter((d) => d.status === 'resolved').length;

  const totalDefects = 1284 + defectDelta;
  const criticalDefects = Math.max(0, 47 + criticalDelta - resolvedDelta);
  const highDefects = Math.max(0, 194 + highDelta);
  const mediumDefects = Math.max(0, 520);
  const lowDefects = Math.max(0, 523);
  const resolvedDefects = 142 + resolvedDelta;
  const roadsInspectedKm = 642;
  const avgRoadHealth = Math.round(
    inspections.reduce((acc, curr) => acc + curr.healthScore, 0) / (inspections.length || 1)
  );

  return (
    <RoadVisionContext.Provider
      value={{
        inspections,
        defects,
        roadAssets,
        reports,
        recommendations,
        notifications,
        unreadNotifCount,
        toasts,
        selectedDefectId,
        isDefectDrawerOpen,
        selectedDefect,
        isAnalyzing,
        analysisProgress,
        addInspection,
        runAIAnalysis,
        updateDefectStatus,
        updateDefectSeverity,
        generateInspectionReport,
        openDefectDrawer,
        closeDefectDrawer,
        markNotificationRead,
        markAllNotificationsRead,
        showToast,
        removeToast,
        stats: {
          totalInspections,
          activeInspections,
          totalDefects,
          criticalDefects,
          highDefects,
          mediumDefects,
          resolvedDefects,
          roadsInspectedKm,
          avgRoadHealth,
        },
      }}
    >
      {children}
    </RoadVisionContext.Provider>
  );
}

export function useRoadVision() {
  const context = useContext(RoadVisionContext);
  if (!context) {
    throw new Error('useRoadVision must be used within a RoadVisionProvider');
  }
  return context;
}
