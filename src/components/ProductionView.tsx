import React, { useState } from 'react';
import {
  Layers,
  Zap,
  Sliders,
  CheckCircle2,
  Filter,
  Flame,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import type { SourceVideo, EditingStyle } from '../types';

interface ProductionViewProps {
  sources: SourceVideo[];
  onStartBatch: (config: any) => Promise<void>;
}

export const ProductionView: React.FC<ProductionViewProps> = ({ sources, onStartBatch }) => {
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(
    sources.map((s) => s.id)
  );
  const [targetVolume, setTargetVolume] = useState<number>(60);
  const [targetDurationRange, setTargetDurationRange] = useState<string>('75-90s');
  const [selectedStyles, setSelectedStyles] = useState<EditingStyle[]>([
    'Podcast',
    'Storytelling',
    'News',
  ]);
  const [minViralScore, setMinViralScore] = useState<number>(75);
  const [minQcScore, setMinQcScore] = useState<number>(85);
  const [maxFinalists, setMaxFinalists] = useState<number>(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);

  const toggleSource = (id: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleStyle = (style: EditingStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleLaunchBatch = async () => {
    setIsProcessing(true);
    setBatchSuccessMessage(null);
    try {
      await onStartBatch({
        sourceVideoIds: selectedSourceIds,
        targetCandidatesVolume: targetVolume,
        durationRange: targetDurationRange,
        editingStyles: selectedStyles,
        viralScoreThreshold: minViralScore,
        qualityScoreThreshold: minQcScore,
        maxFinalistsLimit: maxFinalists,
      });
      setBatchSuccessMessage(
        `Batch démarré avec succès ! ${maxFinalists} clips finalistes de qualité supérieure vont être produits et vérifiés par l'IA.`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Funnel calculations simulation
  const funnelCandidats = targetVolume;
  const funnelInteressants = Math.round(targetVolume * 0.45);
  const funnelMontages = Math.round(funnelInteressants * 0.5);
  const funnelExcellents = Math.round(funnelMontages * 0.5);
  const funnelFinalistes = Math.min(funnelExcellents, maxFinalists);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Production Batch Automatisée
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configurez et lancez l'usine : 100 candidats détectés &rarr; 40 retenus &rarr; 20 montés &rarr; 10 clips &ge; 90 QC &rarr; 5 finalistes d'élite
          </p>
        </div>

        <button
          onClick={handleLaunchBatch}
          disabled={isProcessing || selectedSourceIds.length === 0}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Génération du Batch en cours...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Lancer le Batch de Production</span>
            </>
          )}
        </button>
      </div>

      {batchSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{batchSuccessMessage}</span>
        </div>
      )}

      {/* Grid: Config Left + Funnel Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Sources selection */}
          <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Sélectionner les Sources Vidéos
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {selectedSourceIds.length} sélectionnée(s)
              </span>
            </div>

            <div className="space-y-2">
              {sources.map((s) => (
                <div
                  key={s.id}
                  onClick={() => toggleSource(s.id)}
                  className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedSourceIds.includes(s.id)
                      ? 'border-slate-900 bg-[#F9F9F7]'
                      : 'border-[#EAEAE5] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedSourceIds.includes(s.id)}
                      onChange={() => {}}
                      className="rounded text-slate-900 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{s.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {Math.floor(s.duration / 60)} min • {s.speakerCount} speakers
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Target Volume & Duration */}
          <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Volume & Durée Cible (Creator Rewards)
            </h3>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span>Candidats bruts à analyser :</span>
                <span className="font-bold text-slate-900">{targetVolume} candidats</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={targetVolume}
                onChange={(e) => setTargetVolume(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Fenêtre de Durée (Monétisation &ge; 60s obligatoire)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['60-75s', '75-90s', '90-120s', '120-180s'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setTargetDurationRange(range)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      targetDurationRange === range
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'bg-[#F9F9F7] text-slate-700 hover:bg-slate-200 border border-[#EAEAE5]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Styles & Quality Thresholds */}
          <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Styles Éditoriaux & Filtres Qualité
            </h3>

            <div className="flex flex-wrap gap-2">
              {(['Podcast', 'News', 'Storytelling', 'Debate', 'Fast-paced'] as EditingStyle[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleStyle(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedStyles.includes(st)
                        ? 'bg-slate-900 text-white'
                        : 'bg-[#F9F9F7] text-slate-600 hover:bg-slate-200 border border-[#EAEAE5]'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Seuil Viral Score Min : <strong>{minViralScore}</strong>/100
                </span>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={minViralScore}
                  onChange={(e) => setMinViralScore(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  Seuil Quality Control Min : <strong>{minQcScore}</strong>/100
                </span>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={minQcScore}
                  onChange={(e) => setMinQcScore(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Funnel Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#EAEAE5] shadow-xs space-y-5">
            <div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Entonnoir de Sélection par la Qualité
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chaque étape élimine le contenu moyen pour ne retenir que les pépites.
              </p>
            </div>

            {/* Visual Funnel Blocks */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-100 rounded-lg flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">1. Candidats Bruts Détectés</span>
                <span className="text-sm font-extrabold text-slate-900">{funnelCandidats}</span>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900">2. Filtrage Sémantique & Hooks</span>
                <span className="text-sm font-extrabold text-indigo-900">{funnelInteressants}</span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-900">3. Montages 9:16 & Smart Crop</span>
                <span className="text-sm font-extrabold text-purple-900">{funnelMontages}</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-900">4. Clips QC &ge; 90/100</span>
                <span className="text-sm font-extrabold text-amber-900">{funnelExcellents}</span>
              </div>

              <div className="p-4 bg-[#0F172A] text-white rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Finalistes Programmables
                  </span>
                  <span className="text-xs font-bold">Prêts pour le Creator Rewards</span>
                </div>
                <span className="text-xl font-black text-white">{funnelFinalistes} clips</span>
              </div>
            </div>

            <div className="p-3 bg-[#F9F9F7] rounded-lg border border-[#EAEAE5] text-[11px] text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">Garantie Anti-Spam ClipForge :</p>
              Les clips générés ne sont pas des découpes brutes. Ils comportent un hook contextuel, une progression narrative complète en 7 temps, et un mastering sonore broadcast.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
