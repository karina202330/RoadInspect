import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DefectSeverity, DefectStatus, DefectType, InspectionStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeverity(severity: DefectSeverity): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  badgeClass: string;
} {
  switch (severity) {
    case 'critical':
      return {
        label: 'Critical',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
      };
    case 'high':
      return {
        label: 'High',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      };
    case 'medium':
      return {
        label: 'Medium',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'low':
      return {
        label: 'Low',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    default:
      return {
        label: severity,
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500',
        badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
      };
  }
}

export function formatDefectType(type: DefectType): string {
  const map: Record<DefectType, string> = {
    pothole: 'Pothole',
    longitudinal_crack: 'Longitudinal Crack',
    transverse_crack: 'Transverse Crack',
    alligator_crack: 'Alligator Crack',
    rutting: 'Surface Rutting',
    road_edge_damage: 'Road Edge Damage',
    lane_marking_damage: 'Lane Marking Fade',
    surface_degradation: 'Surface Degradation',
    debris: 'Debris / Obstruction',
    shoulder_damage: 'Shoulder Damage',
  };
  return map[type] || type.replace('_', ' ');
}

export function formatDefectStatus(status: DefectStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'new':
      return { label: 'New Detection', badgeClass: 'bg-slate-100 text-slate-800 border-slate-200' };
    case 'verified':
      return { label: 'Verified', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'assigned':
      return { label: 'Assigned', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'in_progress':
      return { label: 'In Progress', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'resolved':
      return { label: 'Resolved', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    case 'rejected':
      return { label: 'Rejected', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
    default:
      return { label: status, badgeClass: 'bg-slate-50 text-slate-600 border-slate-200' };
  }
}

export function formatInspectionStatus(status: InspectionStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'draft':
      return { label: 'Draft', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300' };
    case 'processing':
      return { label: 'AI Processing', badgeClass: 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse' };
    case 'in_review':
      return { label: 'In Review', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'completed':
      return { label: 'Completed', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'archived':
      return { label: 'Archived', badgeClass: 'bg-slate-100 text-slate-500 border-slate-200' };
    default:
      return { label: status, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
}

export function getHealthScoreColor(score: number): {
  color: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  label: string;
} {
  if (score >= 85) {
    return {
      color: '#16A34A',
      textClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
      label: 'Excellent',
    };
  } else if (score >= 70) {
    return {
      color: '#2563EB',
      textClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      label: 'Good / Fair',
    };
  } else if (score >= 50) {
    return {
      color: '#D97706',
      textClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      label: 'Moderate',
    };
  } else {
    return {
      color: '#DC2626',
      textClass: 'text-red-600',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      label: 'Critical Concern',
    };
  }
}
