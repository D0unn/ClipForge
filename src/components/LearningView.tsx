import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  FlaskConical,
  CheckCircle2,
  Sliders,
  Flame,
  Zap,
} from 'lucide-react';
import type { AnalyticsData } from '../types';

interface LearningViewProps {
  analytics: AnalyticsData | null;
}

export const LearningView: React.FC<LearningViewProps> = ({ analytics }) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'experiments'>('insights');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Boucle d'Apprentissage IA & Expérimentations A/B
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            L'algorithme analyse en continu les métriques TikTok réelles pour calibrer les futurs découpages et hooks
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-[#EAEAE5] shadow-xs">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'insights' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Insights Découverts
          </button>
          <button
            onClick={() => setActiveTab('experiments')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'experiments' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tests A/B Actifs
          </button>
        </div>
      </div>

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics?.learningInsights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white p-6 rounded-2xl border border-[#EAEAE5] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase tracking-wider">
                    {insight.category}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {Math.round(insight.confidenceScore * 100)}% Confiance Algorithmique
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {insight.observation}
                </h3>

                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Action Recommandée par ClipForge :
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {insight.recommendation}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span>Échantillon : <strong className="text-slate-800">{insight.sampleSize} vidéos</strong></span>
                <span className="text-emerald-700 font-bold">Auto-appliqué aux batchs</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'experiments' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#EAEAE5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FlaskConical className="w-4 h-4 text-indigo-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Expérience #EXP-08 : Hook Émotionnel vs Hook Question Paradoxale
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                En Cours (14/20 Vidéos)
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Mesure de l'impact direct sur le taux de complétion à 60 secondes pour maximiser les vues qualifiées Creator Rewards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#F9F9F7] rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Variante A : Question Paradoxale</span>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Rétention 5s : <strong className="text-emerald-700">76.4%</strong></div>
                  <div>Complétion totale : <strong className="text-slate-900">44.8%</strong></div>
                </div>
              </div>

              <div className="p-4 bg-[#F9F9F7] rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Variante B : Choc / Statistique</span>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Rétention 5s : <strong className="text-slate-900">68.1%</strong></div>
                  <div>Complétion totale : <strong className="text-slate-900">38.2%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
