import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Calendar,
  XCircle,
  Clapperboard,
  Flame,
  ShieldCheck,
  Zap,
  Filter,
  Copy,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';
import type { Clip, EditingStyle, ClipStatus } from '../types';

interface ClipsViewProps {
  clips: Clip[];
  onSelectClip: (clip: Clip) => void;
  onApproveClip: (clipId: string) => void;
  onRejectClip: (clipId: string) => void;
  onCreateVariant: (clipId: string, style: EditingStyle) => void;
  onRunCritique: (clipId: string) => void;
  onScheduleClip: (clip: Clip) => void;
}

export const ClipsView: React.FC<ClipsViewProps> = ({
  clips,
  onSelectClip,
  onApproveClip,
  onRejectClip,
  onCreateVariant,
  onRunCritique,
  onScheduleClip,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [minViralScore, setMinViralScore] = useState<number>(0);
  const [onlyCreatorRewardsEligible, setOnlyCreatorRewardsEligible] = useState<boolean>(true);

  const stylesList: EditingStyle[] = ['Podcast', 'News', 'Storytelling', 'Debate', 'Fast-paced'];

  const filteredClips = clips.filter((clip) => {
    if (selectedStyle !== 'all' && clip.style !== selectedStyle) return false;
    if (selectedStatus !== 'all' && clip.status !== selectedStatus) return false;
    if (clip.viralScore < minViralScore) return false;
    if (onlyCreatorRewardsEligible && clip.duration < 60) return false;
    return true;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Bibliothèque AI Clips & Candidats
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Détection narrative IA, expansion de contexte et scoring de transformation pour le Creator Rewards Program
          </p>
        </div>

        {/* Creator Rewards Filter Pill */}
        <button
          onClick={() => setOnlyCreatorRewardsEligible(!onlyCreatorRewardsEligible)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
            onlyCreatorRewardsEligible
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-white text-slate-600 border-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Filtre Creator Rewards (≥ 60s) : {onlyCreatorRewardsEligible ? 'Actif' : 'Tous'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#EAEAE5] shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Style Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Style:
          </span>
          <button
            onClick={() => setSelectedStyle('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedStyle === 'all'
                ? 'bg-[#0F172A] text-white'
                : 'bg-[#F9F9F7] text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tous
          </button>
          {stylesList.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStyle(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedStyle === st
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-[#F9F9F7] text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2">Statut:</span>
          {['all', 'Candidate', 'Approved', 'Scheduled', 'Published'].map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedStatus === stat
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-[#F9F9F7] text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stat === 'all' ? 'Tous les statuts' : stat}
            </button>
          ))}
        </div>
      </div>

      {/* Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClips.map((clip) => (
          <div
            key={clip.id}
            className="bg-white rounded-xl border border-[#EAEAE5] overflow-hidden shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between group"
          >
            {/* Card Header & Poster */}
            <div>
              <div className="relative h-44 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onSelectClip(clip)}>
                <img
                  src={clip.thumbnailUrl}
                  alt={clip.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Duration Badge */}
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-xs font-bold">
                  {clip.duration}s
                </span>

                {/* Creator Rewards Pill */}
                {clip.duration >= 60 && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>Monétisation OK</span>
                  </span>
                )}

                {/* Style Badge */}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/90 text-slate-900 text-[10px] font-bold backdrop-blur-xs">
                  {clip.style}
                </span>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3">
                {/* Scores Bar */}
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-100 text-center">
                  <div className="bg-[#F9F9F7] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block">VIRAL</span>
                    <span className="text-xs font-extrabold text-emerald-700">{clip.viralScore}/100</span>
                  </div>
                  <div className="bg-[#F9F9F7] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block">TRANSFO</span>
                    <span className="text-xs font-extrabold text-indigo-700">{clip.transformationScore}/100</span>
                  </div>
                  <div className="bg-[#F9F9F7] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block">QC</span>
                    <span className="text-xs font-extrabold text-slate-800">{clip.qualityScore}/100</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3
                    onClick={() => onSelectClip(clip)}
                    className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-slate-700 cursor-pointer"
                  >
                    {clip.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    Source: {clip.sourceTitle}
                  </p>
                </div>

                {/* Active Hook Statement */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Hook ({clip.hooks[clip.selectedHookIndex]?.type || 'Question'})</span>
                    <span className="text-emerald-700">{clip.hooks[clip.selectedHookIndex]?.viralPotential || 90}% Potentiel</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                    "{clip.hooks[clip.selectedHookIndex]?.text || clip.storyStructure.hook}"
                  </p>
                </div>

                {/* 7-part story structure preview pill */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Structure Narrative IA</span>
                  <div className="flex items-center space-x-1 text-[9px] font-mono text-slate-600 overflow-x-auto py-1">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded">Hook</span>
                    <span>→</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded">Context</span>
                    <span>→</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded">Development</span>
                    <span>→</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded">Conclusion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-[#FBFBF9] border-t border-[#EAEAE5] flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectClip(clip)}
                className="px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1"
              >
                <Clapperboard className="w-3.5 h-3.5" />
                <span>Ouvrir Éditeur</span>
              </button>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onRunCritique(clip.id)}
                  title="Exécuter l'Auto-Critique IA"
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-[#EAEAE5] rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                </button>

                {clip.status !== 'Approved' && clip.status !== 'Scheduled' && clip.status !== 'Published' && (
                  <button
                    onClick={() => onApproveClip(clip.id)}
                    title="Valider pour programmation"
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {(clip.status === 'Approved' || clip.status === 'Candidate') && (
                  <button
                    onClick={() => onScheduleClip(clip)}
                    title="Programmer sur TikTok"
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onRejectClip(clip.id)}
                  title="Rejeter le clip"
                  className="p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-[#EAEAE5] rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
