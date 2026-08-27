import React from 'react';
import {
  Film,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Eye,
  DollarSign,
  ArrowUpRight,
  Play,
  Layers,
  ChevronRight,
  Flame,
  ShieldCheck,
  Zap,
  Cpu,
  Check,
} from 'lucide-react';
import type { SourceVideo, Clip, AnalyticsData, QueueJob, SystemMonitoring } from '../types';

interface DashboardViewProps {
  sources: SourceVideo[];
  clips: Clip[];
  analytics: AnalyticsData | null;
  monitoring: SystemMonitoring | null;
  jobs: QueueJob[];
  onSelectClip: (clip: Clip) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sources,
  clips,
  analytics,
  monitoring,
  jobs,
  onSelectClip,
  onNavigateTab,
}) => {
  const candidatesCount = clips.filter((c) => c.status === 'Candidate').length;
  const approvedCount = clips.filter((c) => c.status === 'Approved').length;
  const scheduledCount = clips.filter((c) => c.status === 'Scheduled').length;
  const publishedCount = clips.filter((c) => c.status === 'Published').length;
  const activeJobsCount = jobs.filter((j) => j.status === 'PROCESSING').length;

  const topCandidates = clips.filter((c) => c.status === 'Candidate' || c.status === 'Approved').slice(0, 3);

  return (
    <div id="dashboard-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Usine de Production Locale
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatisation 9:16 éditorialisée pour le TikTok Creator Rewards Program (≥ 60s)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-dash-import"
            onClick={() => onNavigateTab('sources')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Film className="w-3.5 h-3.5 text-slate-600" />
            <span>Importer une Vidéo</span>
          </button>

          <button
            id="btn-dash-batch"
            onClick={() => onNavigateTab('production')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Lancer un Batch</span>
          </button>
        </div>
      </div>

      {/* Production Pipeline Flow */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-700" />
            <span>Flux de Production</span>
          </span>
          <span className="text-slate-500">Filtrage sélectif qualité & monétisation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
          <button
            onClick={() => onNavigateTab('sources')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-slate-500 block uppercase font-medium">1. Sources</span>
            <span className="text-base font-bold text-slate-900">{sources.length}</span>
          </button>

          <button
            onClick={() => onNavigateTab('clips')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-slate-500 block uppercase font-medium">2. Candidats</span>
            <span className="text-base font-bold text-slate-900">{candidatesCount}</span>
          </button>

          <button
            onClick={() => onNavigateTab('clips')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-slate-500 block uppercase font-medium">3. Validés</span>
            <span className="text-base font-bold text-emerald-800">{approvedCount}</span>
          </button>

          <button
            onClick={() => onNavigateTab('queue')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-slate-500 block uppercase font-medium">4. Rendu & Queue</span>
            <span className="text-base font-bold text-slate-900">{activeJobsCount} actif(s)</span>
          </button>

          <button
            onClick={() => onNavigateTab('scheduler')}
            className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-slate-500 block uppercase font-medium">5. Programmés</span>
            <span className="text-base font-bold text-slate-900">{scheduledCount}</span>
          </button>

          <button
            onClick={() => onNavigateTab('tiktok')}
            className="p-3 bg-slate-900 text-white rounded-lg text-left transition-colors cursor-pointer"
          >
            <span className="text-[10px] text-slate-300 block uppercase font-medium">6. Publiés</span>
            <span className="text-base font-bold text-white">{publishedCount}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Qualified Views */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Vues Qualifiées (≥60s)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {analytics?.overview.qualifiedViews.toLocaleString() ?? '2,688,000'}
          </div>
          <div className="text-[11px] text-slate-500">
            <span className="font-semibold text-slate-800">70.0%</span> de taux d'éligibilité Creator Rewards
          </div>
        </div>

        {/* Estimated Earnings */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Revenus Estimés</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ${analytics?.overview.estimatedRewardsTotal.toFixed(2) ?? '2,150.40'}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>RPM Actuel :</span>
            <span className="font-semibold text-slate-800">
              ${analytics?.overview.currentEstimatedRpm.toFixed(2) ?? '0.80'} / 1k vues
            </span>
          </div>
        </div>

        {/* Local Hardware Status (Coherent with GPU / Settings) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Moteur GPU Local</span>
            <Cpu className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-sm font-bold text-slate-900">
            {monitoring?.gpuName || 'NVIDIA RTX 4090 (24GB VRAM)'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>VRAM : {monitoring?.vramUsedGb || 8.4} / 24.0 GB</span>
            <span className="font-semibold text-slate-800">{monitoring?.gpuTempCelsius || 58}°C</span>
          </div>
        </div>
      </div>

      {/* Candidate Clips for Quick Action */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" />
            <span>Clips Prêts à Être Programmés ({clips.length})</span>
          </h2>
          <button
            onClick={() => onNavigateTab('clips')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Bibliothèque complète</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {topCandidates.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Aucun clip généré pour le moment. Cliquez sur "Importer une Vidéo" pour débuter.
            </div>
          ) : (
            topCandidates.map((clip) => (
              <div
                key={clip.id}
                onClick={() => onSelectClip(clip)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-16 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-white text-[8px] font-mono rounded">
                      {clip.duration}s
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800">
                        {clip.style}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Viral {clip.viralScore}
                      </span>
                      {clip.duration >= 60 && (
                        <span className="text-[10px] font-bold text-slate-600">≥ 60s Monétisable</span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{clip.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {clip.hooks[clip.selectedHookIndex]?.text || clip.storyStructure.hook}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClip(clip);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab('scheduler');
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Planifier
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
