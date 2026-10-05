'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Plus,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  AlertOctagon,
  Info,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useRoadVision } from '@/lib/context/RoadVisionContext';
import { cn } from '@/lib/utils';

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
    inspections,
    defects,
    roadAssets,
    reports,
  } = useRoadVision();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0 || parts[0] === 'dashboard') {
      return [{ label: 'Overview', href: '/dashboard' }];
    }

    const crumbs = [];
    if (parts[0] === 'inspections') {
      crumbs.push({ label: 'Inspections', href: '/inspections' });
      if (parts[1] === 'new') {
        crumbs.push({ label: 'New Inspection Project', href: '/inspections/new' });
      } else if (parts[1]) {
        crumbs.push({ label: `NH-48 (${parts[1]})`, href: `/inspections/${parts[1]}` });
      }
    } else if (parts[0] === 'analysis') {
      crumbs.push({ label: 'Inspections', href: '/inspections' });
      crumbs.push({ label: 'AI Road Vision Analysis', href: pathname });
    } else if (parts[0] === 'defects') {
      crumbs.push({ label: 'Defect Register', href: '/defects' });
    } else if (parts[0] === 'assets') {
      crumbs.push({ label: 'Road Assets', href: '/assets' });
      if (parts[1]) {
        crumbs.push({ label: parts[1], href: `/assets/${parts[1]}` });
      }
    } else if (parts[0] === 'analytics') {
      crumbs.push({ label: 'Infrastructure Analytics', href: '/analytics' });
    } else if (parts[0] === 'reports') {
      crumbs.push({ label: 'Inspection Reports', href: '/reports' });
      if (parts[1]) {
        crumbs.push({ label: parts[1], href: `/reports/${parts[1]}` });
      }
    } else if (parts[0] === 'settings') {
      crumbs.push({ label: 'System Settings', href: '/settings' });
    } else {
      crumbs.push({ label: parts[0], href: pathname });
    }
    return crumbs;
  };

  // Search filter results
  const q = searchQuery.trim().toLowerCase();
  const searchResults = q
    ? {
        inspections: inspections.filter(
          (i) =>
            i.id.toLowerCase().includes(q) ||
            i.projectName.toLowerCase().includes(q) ||
            i.roadName.toLowerCase().includes(q) ||
            i.location.toLowerCase().includes(q)
        ),
        defects: defects.filter(
          (d) =>
            d.id.toLowerCase().includes(q) ||
            d.title.toLowerCase().includes(q) ||
            d.location.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q)
        ),
        assets: roadAssets.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.highway.toLowerCase().includes(q) ||
            a.segment.toLowerCase().includes(q)
        ),
        reports: reports.filter(
          (r) =>
            r.id.toLowerCase().includes(q) ||
            r.projectName.toLowerCase().includes(q)
        ),
      }
    : null;

  const totalResultsCount = searchResults
    ? searchResults.inspections.length +
      searchResults.defects.length +
      searchResults.assets.length +
      searchResults.reports.length
    : 0;

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-6">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px]">
        <Link
          href="/dashboard"
          className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          ROADVISION
        </Link>
        {getBreadcrumbs().map((crumb, idx) => (
          <React.Fragment key={crumb.href + idx}>
            <span className="text-slate-300">/</span>
            <Link
              href={crumb.href}
              className={cn(
                'font-medium transition-colors',
                idx === getBreadcrumbs().length - 1
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div ref={searchRef} className="relative">
          <div className="relative w-64 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search highway, defect ID, project... (e.g. NH-48)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-dropdown border border-slate-200 p-2 z-50 max-h-[460px] overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Search Results</span>
                <span>{totalResultsCount} found</span>
              </div>

              {totalResultsCount === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No matching highway, defect, or project found for "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Inspections */}
                  {searchResults?.inspections && searchResults.inspections.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-blue-700 px-3 py-1">
                        Inspections ({searchResults.inspections.length})
                      </div>
                      {searchResults.inspections.map((i) => (
                        <button
                          key={i.id}
                          onClick={() => {
                            router.push(`/inspections/${i.id}`);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group text-[13px]"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                              {i.id} · {i.roadName}
                            </div>
                            <div className="text-[11px] text-slate-400">{i.projectName}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Defects */}
                  {searchResults?.defects && searchResults.defects.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-red-700 px-3 py-1">
                        Defects ({searchResults.defects.length})
                      </div>
                      {searchResults.defects.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            router.push('/defects');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group text-[13px]"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                              {d.id} · {d.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {d.location} · {d.severity.toUpperCase()}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Assets */}
                  {searchResults?.assets && searchResults.assets.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-emerald-700 px-3 py-1">
                        Road Assets ({searchResults.assets.length})
                      </div>
                      {searchResults.assets.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => {
                            router.push('/assets');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between group text-[13px]"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                              {a.highway} · {a.name}
                            </div>
                            <div className="text-[11px] text-slate-400">{a.segment}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Cluster Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Vision Ready</span>
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-dropdown border border-slate-200 p-2 z-50">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900">Notifications</h4>
                  <p className="text-[11px] text-slate-400">
                    {unreadNotifCount} unread system & inspection alerts
                  </p>
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) {
                          router.push(n.link);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={cn(
                        'p-3 hover:bg-slate-50 transition-colors cursor-pointer text-left',
                        !n.read && 'bg-blue-50/40'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {n.type === 'critical' ? (
                            <AlertOctagon className="w-4 h-4 text-red-600" />
                          ) : n.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-slate-800">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-[12px] text-slate-600 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[12px] text-blue-600 hover:underline font-medium"
                >
                  View all alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: + New Inspection */}
        <Link
          href="/inspections/new"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold shadow-sm shadow-blue-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Inspection</span>
        </Link>
      </div>
    </header>
  );
}
