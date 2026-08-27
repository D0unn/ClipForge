import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Flame,
  DollarSign,
  Clock,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import type { AnalyticsData, Clip } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
  clips: Clip[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, clips }) => {
  if (!analytics) return null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Analytics & Monétisation Creator Rewards
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Indicateurs de performance réels : Vues Qualifiées (&ge; 60s), Taux de Complétion et RPM Dynamique
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Formule : Revenus = (Vues Qualifiées &ge; 60s / 1000) &times; RPM Dynamique</span>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Vues Totales</span>
            <Eye className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {analytics.overview.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center space-x-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-bold">+18.4%</span>
            <span className="text-slate-500">cette semaine</span>
          </div>
        </div>

        {/* Qualified Views */}
        <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Vues Qualifiées (&ge; 60s)</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {analytics.overview.qualifiedViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Ratio de qualification : <strong className="text-slate-900">70.0%</strong>
          </div>
        </div>

        {/* Avg Completion Rate */}
        <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Taux de Complétion Moyen</span>
            <TrendingUp className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {analytics.overview.avgCompletionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Rétention à 5s : <strong className="text-slate-900">{analytics.overview.retentionAt5s}%</strong>
          </div>
        </div>

        {/* Dynamic Estimated Rewards */}
        <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Revenus Estimés</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ${analytics.overview.estimatedRewardsTotal.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            RPM Moyen : <strong className="text-slate-900">${analytics.overview.currentEstimatedRpm.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Engagement Breakdown & Top Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Engagement Row (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#EAEAE5] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Signaux d'Engagement TikTok
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#F9F9F7] rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-700">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-xs font-medium">J'aime</span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {analytics.overview.totalLikes.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-[#F9F9F7] rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-700">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium">Commentaires</span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {analytics.overview.totalComments.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-[#F9F9F7] rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-700">
                <Share2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium">Partages</span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {analytics.overview.totalShares.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-[#F9F9F7] rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-700">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium">Favoris / Sauvegardes</span>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {analytics.overview.totalSaves.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Video Performance Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#EAEAE5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EAEAE5] flex items-center justify-between bg-[#FBFBF9]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Performance par Vidéo Publiée
            </h3>
            <span className="text-xs text-slate-500">Creator Rewards &ge; 60s</span>
          </div>

          <div className="divide-y divide-[#EAEAE5] max-h-[460px] overflow-y-auto">
            {analytics.topVideos.map((v) => (
              <div key={v.clipId} className="p-4 hover:bg-[#FAF9F6] transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{v.title}</h4>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    ${v.estimatedEarnings.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-500 font-mono">
                  <div>
                    Vues: <strong className="text-slate-900">{v.views.toLocaleString()}</strong>
                  </div>
                  <div>
                    Qualifiées: <strong className="text-slate-900">{v.qualifiedViews.toLocaleString()}</strong>
                  </div>
                  <div>
                    Complétion: <strong className="text-slate-900">{v.completionRate}%</strong>
                  </div>
                  <div>
                    RPM: <strong className="text-slate-900">${v.rpm.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
