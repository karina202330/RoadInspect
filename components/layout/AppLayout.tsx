'use client';

import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from './ToastContainer';
import { DefectDetailDrawer } from '@/components/defects/DefectDetailDrawer';
import { AIProcessingModal } from '@/components/analysis/AIProcessingModal';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 flex font-sans antialiased">
      {/* Fixed Left Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 max-w-[1720px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Drawers & Modals */}
      <DefectDetailDrawer />
      <AIProcessingModal />
      <ToastContainer />
    </div>
  );
}
