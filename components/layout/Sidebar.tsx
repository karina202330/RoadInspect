'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanEye,
  Layers,
  AlertTriangle,
  BarChart3,
  FileText,
  Bell,
  Settings,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRoadVision } from '@/lib/context/RoadVisionContext';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Inspections',
    href: '/inspections',
    icon: ScanEye,
    badgeKey: 'activeInspections',
  },
  {
    name: 'Road Assets',
    href: '/assets',
    icon: Layers,
  },
  {
    name: 'Defect Register',
    href: '/defects',
    icon: AlertTriangle,
    badgeKey: 'criticalDefects',
    badgeVariant: 'critical',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
  },
];

const SECONDARY_NAV = [
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badgeKey: 'unreadNotifCount',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { stats, unreadNotifCount } = useRoadVision();

  const getBadgeValue = (key?: string) => {
    if (key === 'activeInspections') return stats.activeInspections > 0 ? stats.activeInspections : undefined;
    if (key === 'criticalDefects') return stats.criticalDefects > 0 ? stats.criticalDefects : undefined;
    if (key === 'unreadNotifCount') return unreadNotifCount > 0 ? unreadNotifCount : undefined;
    return undefined;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-100 flex items-center px-5 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19L9 5" />
            <path d="M20 19L15 5" />
            <line x1="12" y1="7" x2="12" y2="9" />
            <line x1="12" y1="13" x2="12" y2="15" />
            <line x1="12" y1="19" x2="12" y2="21" />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[16px] tracking-tight text-slate-900 leading-none">
              ROADVISION
            </span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 leading-none">
              AI
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
            Road Infrastructure Intel
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Platform
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/' || pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              const badge = getBadgeValue(item.badgeKey);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group',
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {badge !== undefined && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight',
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeVariant === 'critical'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-4">
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <nav className="space-y-1">
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              const badge = getBadgeValue(item.badgeKey);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group',
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {badge !== undefined && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight',
                        isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Live System Telemetry Card */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Pipeline Live
            </span>
            <span className="text-[10px] text-slate-400">YOLO-v11x</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
            <span className="text-slate-500">Inference Avg</span>
            <span className="font-semibold text-slate-800">42ms / frame</span>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <Link
          href="/settings"
          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold group-hover:bg-blue-600 transition-colors">
                HR
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                Harsh Rathod
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Inspection Director
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
