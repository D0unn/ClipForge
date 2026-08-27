import React from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { SystemMonitoring, TikTokAccount, QueueJob } from '../types';

interface HeaderProps {
  monitoring: SystemMonitoring | null;
  tikTokAccount: TikTokAccount | null;
  activeJobsCount: number;
  onOpenQueue: () => void;
  onOpenTikTok: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  monitoring,
  tikTokAccount,
  activeJobsCount,
  onOpenQueue,
  onOpenTikTok,
}) => {
  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#EAEAE5] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Workspace Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
            CF
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-[#121316]">ClipForge Studio</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Local Pro v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-500">TikTok 9:16 Creator Rewards Factory (60s–180s)</p>
          </div>
        </div>
      </div>

      {/* Right Hardware Monitoring & Accounts Status */}
      <div className="flex items-center space-x-3">
        {/* Real GPU / VRAM Pill */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-[#F9F9F7] rounded-lg border border-[#EAEAE5] text-xs text-slate-700">
          <Activity className="w-3.5 h-3.5 text-slate-600" />
          <span className="font-medium text-slate-900">GPU</span>
          <span className="text-slate-500">RTX 4090</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">VRAM:</span>
          <span className="font-semibold text-slate-900">
            {monitoring ? `${monitoring.vramUsedGb} / ${monitoring.vramTotalGb} GB` : '10.2 / 24 GB'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="CUDA Active" />
        </div>

        {/* RAM & CPU Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-[#F9F9F7] rounded-lg border border-[#EAEAE5] text-xs text-slate-700">
          <Cpu className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-500">CPU:</span>
          <span className="font-medium text-slate-900">{monitoring?.cpuUsagePercent ?? 34}%</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">RAM:</span>
          <span className="font-medium text-slate-900">
            {monitoring ? `${monitoring.ramUsedGb} / ${monitoring.ramTotalGb} GB` : '11.4 / 32 GB'}
          </span>
        </div>

        {/* Storage Pill */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 bg-[#F9F9F7] rounded-lg border border-[#EAEAE5] text-xs text-slate-700">
          <HardDrive className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-500">SSD:</span>
          <span className="font-medium text-slate-900">
            {monitoring ? `${monitoring.storageUsedGb} GB` : '142 GB'}
          </span>
        </div>

        {/* Active Workers Queue Button */}
        <button
          onClick={onOpenQueue}
          className="flex items-center space-x-2 px-3 py-1.5 bg-[#F9F9F7] hover:bg-slate-100 rounded-lg border border-[#EAEAE5] text-xs transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-slate-700" />
          <span className="font-medium text-slate-800">Queue:</span>
          <span className={`px-1.5 py-0.2 rounded font-semibold text-[11px] ${
            activeJobsCount > 0 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {activeJobsCount} actifs
          </span>
        </button>

        {/* Connected TikTok Account Pill */}
        <button
          onClick={onOpenTikTok}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer bg-[#FFFFFF] hover:border-slate-400 border-[#EAEAE5]"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-700" />
          {tikTokAccount?.isConnected ? (
            <>
              <img
                src={tikTokAccount.avatarUrl}
                alt="TikTok"
                className="w-4 h-4 rounded-full object-cover border border-slate-300"
              />
              <span className="font-medium text-slate-900">{tikTokAccount.username}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </>
          ) : (
            <>
              <span className="text-slate-500">TikTok Déconnecté</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </>
          )}
        </button>
      </div>
    </header>
  );
};
