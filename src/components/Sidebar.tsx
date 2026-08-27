import React from 'react';
import {
  LayoutDashboard,
  Film,
  Sparkles,
  Clapperboard,
  Layers,
  ListTodo,
  Calendar,
  Share2,
  BarChart3,
  BrainCircuit,
  Settings,
  ChevronRight,
  Flame,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'sources'
  | 'clips'
  | 'editor'
  | 'production'
  | 'queue'
  | 'scheduler'
  | 'tiktok'
  | 'analytics'
  | 'learning'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  badgeCounts: {
    sources: number;
    candidates: number;
    approved: number;
    scheduled: number;
    queue: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  badgeCounts,
}) => {
  const navItems: Array<{
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    section?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'PRODUCTION FACTORY' },
    { id: 'sources', label: 'Sources Vidéos', icon: Film, badge: badgeCounts.sources },
    { id: 'clips', label: 'AI Clips & Moments', icon: Sparkles, badge: badgeCounts.candidates },
    { id: 'editor', label: 'Éditeur 9:16', icon: Clapperboard },
    { id: 'production', label: 'Production Batch', icon: Layers, badge: 'Auto' },
    { id: 'queue', label: 'Queue & Workers', icon: ListTodo, badge: badgeCounts.queue },
    { id: 'scheduler', label: 'Scheduler TikTok', icon: Calendar, badge: badgeCounts.scheduled, section: 'DIFFUSION & CROISSANCE' },
    { id: 'tiktok', label: 'Intégration TikTok', icon: Share2 },
    { id: 'analytics', label: 'Analytics & RPM', icon: BarChart3 },
    { id: 'learning', label: 'Learning Loop', icon: BrainCircuit, badge: 'IA' },
    { id: 'settings', label: 'Paramètres & GPU', icon: Settings, section: 'SYSTÈME' },
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#EAEAE5] flex flex-col justify-between select-none h-full">
      <div className="py-4 px-3 space-y-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const showSection = item.section && (idx === 0 || navItems[idx - 1]?.section !== item.section);

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div className="px-3 pt-4 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-[#F9F9F7] hover:text-slate-950'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Creator Rewards Status Box */}
      <div className="p-3 border-t border-[#EAEAE5] m-2 bg-[#F9F9F7] rounded-xl">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-bold text-slate-900">Creator Rewards</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800">
            60s-180s
          </span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Pipeline optimisé pour la monétisation qualifiée TikTok (durée min 60 sec requise).
        </p>
      </div>
    </aside>
  );
};
