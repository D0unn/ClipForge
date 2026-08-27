import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Scissors,
  CheckCircle2,
  Calendar,
  Layers,
  Flame,
  ShieldCheck,
  Type,
  Maximize2,
  Eye,
  BrainCircuit,
  Sliders,
  Radio,
  Image as ImageIcon,
  Zap,
  ChevronRight,
  RefreshCw,
  Share2,
} from 'lucide-react';
import type { Clip, EditDecisionBlock, EditingStyle, CaptionPreset } from '../types';

interface EditorViewProps {
  clip: Clip | null;
  onUpdateClip: (updated: Partial<Clip>) => void;
  onRunCritique: (clipId: string) => void;
  onCreateVariant: (clipId: string, style: EditingStyle) => void;
  onApproveClip: (clipId: string) => void;
  onScheduleClip: (clip: Clip) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  clip,
  onUpdateClip,
  onRunCritique,
  onCreateVariant,
  onApproveClip,
  onScheduleClip,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'hooks' | 'story' | 'crop' | 'captions' | 'audio' | 'qc'>('hooks');
  const [isMuted, setIsMuted] = useState(false);
  const [showFaceBox, setShowFaceBox] = useState(true);

  // Playback timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && clip) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= clip.duration) {
            setIsPlaying(false);
            return 0;
          }
          return Number((prev + 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, clip]);

  if (!clip) {
    return (
      <div className="p-16 text-center text-slate-400 space-y-3">
        <Sparkles className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
        <h3 className="text-base font-bold text-slate-700">Aucun clip sélectionné</h3>
        <p className="text-xs">Sélectionnez un clip depuis la bibliothèque ou les sources pour lancer l'éditeur 9:16.</p>
      </div>
    );
  }

  // Find active EDL block based on playhead position
  const activeBlock = clip.editPlan.find(
    (b) => currentTime >= b.startTime && currentTime < b.endTime
  ) || clip.editPlan[0];

  const handleHookChange = (index: number) => {
    onUpdateClip({ selectedHookIndex: index });
  };

  const handleCaptionPresetChange = (preset: CaptionPreset) => {
    onUpdateClip({ captionStyle: preset });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Bar with Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#EAEAE5] shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            9:16
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">{clip.title}</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                {clip.style}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center space-x-1">
                <Flame className="w-3 h-3 text-amber-600" />
                <span>{clip.duration}s • Creator Rewards OK</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Source: {clip.sourceTitle}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onRunCritique(clip.id)}
            className="px-3 py-1.5 bg-[#F9F9F7] hover:bg-slate-200 text-slate-800 border border-[#EAEAE5] rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-slate-700" />
            <span>Auto-Critique IA</span>
          </button>

          <button
            onClick={() => onApproveClip(clip.id)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Valider le Montage</span>
          </button>

          <button
            onClick={() => onScheduleClip(clip)}
            className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Programmer TikTok</span>
          </button>
        </div>
      </div>

      {/* Main Studio Editor Workspace: Left Player + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 9:16 Vertical Stage Player (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#FFFFFF] p-6 rounded-2xl border border-[#EAEAE5] shadow-xs space-y-4">
          {/* Smartphone 9:16 Bezel Preview */}
          <div className="relative w-[280px] h-[498px] rounded-[32px] overflow-hidden bg-slate-950 border-[6px] border-slate-800 shadow-2xl flex flex-col justify-between select-none">
            {/* Background Video simulation */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={clip.thumbnailUrl}
                alt="preview"
                className="w-full h-full object-cover opacity-85 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Simulated B-Roll Overlay if active */}
              {activeBlock?.type === 'B_ROLL' && activeBlock.bRollAsset && (
                <div className="absolute inset-x-3 top-20 bottom-36 rounded-xl overflow-hidden border-2 border-amber-400/80 bg-black/90 p-2 shadow-2xl flex flex-col justify-between">
                  <img
                    src={activeBlock.bRollAsset.previewUrl}
                    alt="B-Roll"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="bg-slate-900/90 p-2 rounded-lg text-white">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                      B-Roll Overlay Graphique
                    </span>
                    <p className="text-[11px] font-semibold">{activeBlock.bRollAsset.title}</p>
                  </div>
                </div>
              )}

              {/* Active Smart Crop Face Tracking Bounding Box */}
              {showFaceBox && activeBlock?.cropSetting && (
                <div
                  className="absolute border border-emerald-400/90 rounded-lg pointer-events-none transition-all duration-300"
                  style={{
                    left: `${activeBlock.cropSetting.focusPointXPercent - 22}%`,
                    top: '22%',
                    width: '44%',
                    height: '28%',
                    boxShadow: '0 0 12px rgba(52, 211, 153, 0.4)',
                  }}
                >
                  <span className="absolute -top-4 left-1 px-1 py-0.2 bg-emerald-500 text-slate-950 text-[8px] font-bold rounded">
                    {activeBlock.cropSetting.speaker} (Zoom {activeBlock.cropSetting.zoomLevel}x)
                  </span>
                </div>
              )}

              {/* TikTok Safe Zone Overlay: Dynamic Word-synced Captions at 28% from bottom */}
              <div className="absolute inset-x-4 bottom-24 text-center pointer-events-none">
                {clip.captionStyle === 'Bold' && (
                  <div className="inline-block bg-black/80 px-3 py-1.5 rounded-lg border border-white/20 shadow-xl">
                    <span className="text-sm font-black text-amber-300 uppercase tracking-wider drop-shadow-md">
                      {activeBlock?.transcriptSnippet || clip.hooks[clip.selectedHookIndex]?.text || clip.title}
                    </span>
                  </div>
                )}
                {clip.captionStyle === 'Podcast' && (
                  <div className="inline-block bg-slate-900/90 px-3 py-1 rounded-md text-white text-xs font-semibold">
                    "{activeBlock?.transcriptSnippet || clip.title}"
                  </div>
                )}
                {clip.captionStyle === 'Dynamic' && (
                  <div className="text-white text-sm font-extrabold tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black mr-1">
                      TRANSFORMATION
                    </span>
                    <span>ÉDITORIALE</span>
                  </div>
                )}
                {clip.captionStyle === 'News' && (
                  <div className="bg-red-600 text-white px-2 py-0.5 text-[11px] font-bold uppercase rounded shadow">
                    INFO FLASH • TIKTOK CREATOR REWARDS
                  </div>
                )}
              </div>

              {/* Top TikTok UI elements mockup */}
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-white text-[10px] font-medium opacity-80 pointer-events-none">
                <span>Pour toi</span>
                <span className="font-mono text-[9px] bg-black/40 px-1 rounded">{clip.duration}s</span>
              </div>
            </div>

            {/* Bottom Scrubber Indicator */}
            <div className="relative z-10 p-3 flex items-center justify-between text-white text-[10px]">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="font-mono">{formatTime(clip.duration)}</span>
            </div>
          </div>

          {/* Transport Player Controls */}
          <div className="w-full max-w-[320px] flex items-center justify-between px-2">
            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => setShowFaceBox(!showFaceBox)}
              title="Afficher/Masquer le Bounding Box Cadrage Visage"
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                showFaceBox ? 'bg-slate-100 text-emerald-700' : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right: Studio Inspector & AI Engines (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl border border-[#EAEAE5] shadow-xs flex flex-col overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex items-center border-b border-[#EAEAE5] bg-[#FBFBF9] px-4 overflow-x-auto">
            {[
              { id: 'hooks', label: 'Hooks IA', icon: Zap },
              { id: 'story', label: 'Story Structure', icon: Sparkles },
              { id: 'crop', label: 'Smart Crop 9:16', icon: Sliders },
              { id: 'captions', label: 'Sous-titres', icon: Type },
              { id: 'audio', label: 'Mastering Audio', icon: Volume2 },
              { id: 'qc', label: 'Quality Control', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-3 text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#0F172A] text-[#0F172A] bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto max-h-[500px] space-y-5">
            {/* 1. Hook Engine Tab */}
            {activeTab === 'hooks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Générateur de Hooks & Boucles de Rétention
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      3 à 5 déclinaisons générées sur la base du contenu réel sans invention
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Hook Actif #{clip.selectedHookIndex + 1}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {clip.hooks.map((hook, idx) => (
                    <div
                      key={hook.id}
                      onClick={() => handleHookChange(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        clip.selectedHookIndex === idx
                          ? 'border-[#0F172A] bg-[#F9F9F7] shadow-xs'
                          : 'border-[#EAEAE5] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {hook.type}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700">
                          {hook.viralPotential}% Potentiel Viral
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">"{hook.text}"</p>
                      <p className="text-[11px] text-slate-500 mt-1 italic">{hook.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Story Structure Tab (7 Stages) */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Structure Narrative (7 Étapes)
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Durée Totale : {clip.duration}s
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {Object.entries(clip.storyStructure).map(([stepKey, stepText]) => (
                    <div key={stepKey} className="p-3 bg-[#FBFBF9] rounded-lg border border-[#EAEAE5] space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {stepKey.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <p className="font-semibold text-slate-900">{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Smart Crop 9:16 Tab */}
            {activeTab === 'crop' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Cadrage Intelligent & Détection Faciale
                </h3>
                <div className="p-4 bg-[#FBFBF9] rounded-xl border border-[#EAEAE5] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Mode de suivi :</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                      Active Speaker Centering (Automatique)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Compensation de Regard :</span>
                    <span className="font-bold text-slate-900">+12% Headroom Guard</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Zoom dynamique transitions :</span>
                    <span className="font-bold text-slate-900">1.0x → 1.25x sur Punchline</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Captions Preset Tab */}
            {activeTab === 'captions' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Presets de Sous-Titres Dynamiques
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['Bold', 'Podcast', 'Dynamic', 'News', 'Minimal'] as CaptionPreset[]).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleCaptionPresetChange(preset)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        clip.captionStyle === preset
                          ? 'border-[#0F172A] bg-slate-900 text-white'
                          : 'border-[#EAEAE5] bg-white text-slate-900 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">{preset}</span>
                      <span className={`text-[10px] ${clip.captionStyle === preset ? 'text-slate-300' : 'text-slate-500'}`}>
                        {preset === 'Bold' ? 'Mot par mot avec highlight jaune' : preset === 'News' ? 'Bandeau titre rouge & blanc' : 'Sobre et épuré'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Audio Mastering Tab */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mastering Audio Mobile (EBU R128 -14 LUFS)
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#FBFBF9] rounded-lg border border-[#EAEAE5] flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Noise Reduction & Denoise</span>
                    <span className="font-bold text-emerald-700">Actif (-24dB background)</span>
                  </div>
                  <div className="p-3 bg-[#FBFBF9] rounded-lg border border-[#EAEAE5] flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Voice Enhancement & EQ Présence</span>
                    <span className="font-bold text-emerald-700">Optimisé Smartphone</span>
                  </div>
                  <div className="p-3 bg-[#FBFBF9] rounded-lg border border-[#EAEAE5] flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Music Ducking Automatique</span>
                    <span className="font-bold text-emerald-700">-18dB sous la voix</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Quality Control & Self-Critique Tab */}
            {activeTab === 'qc' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Quality Control & Self-Critique IA
                  </h3>
                  <span className="text-sm font-extrabold text-emerald-700">
                    Score : {clip.qualityScore}/100
                  </span>
                </div>

                {/* Self-Critique Box */}
                <div className="p-4 bg-[#F9F9F7] rounded-xl border border-[#EAEAE5] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Itération Critique IA #{clip.qualityReport.selfCritique.critiqueIteration}</span>
                    <button
                      onClick={() => onRunCritique(clip.id)}
                      className="text-[10px] font-bold text-slate-700 hover:text-slate-950 flex items-center cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Réévaluer
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 block">FORCES :</span>
                    <ul className="list-disc pl-4 text-slate-700 text-[11px] space-y-0.5">
                      {clip.qualityReport.selfCritique.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Checks List */}
                <div className="space-y-1.5 text-xs">
                  {clip.qualityReport.checks.map((check) => (
                    <div
                      key={check.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800">{check.name}</span>
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Conforme
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Multi-Track Timeline */}
          <div className="p-4 bg-[#F9F9F7] border-t border-[#EAEAE5] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Timeline Multi-Pistes 9:16</span>
              </span>
              <span className="font-mono text-slate-500">
                {formatTime(currentTime)} / {formatTime(clip.duration)}
              </span>
            </div>

            {/* Clickable Multi-Track Timeline */}
            <div
              className="space-y-1.5 cursor-pointer bg-slate-900 p-2.5 rounded-xl select-none"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                setCurrentTime(Number((ratio * clip.duration).toFixed(1)));
              }}
            >
              {/* Track 1: Video Cuts (EDL) */}
              <div className="flex h-6 rounded overflow-hidden space-x-0.5 bg-slate-800 text-[9px] font-mono text-white">
                {clip.editPlan.map((block) => {
                  const widthPercent = (block.duration / clip.duration) * 100;
                  const isActive = currentTime >= block.startTime && currentTime < block.endTime;
                  return (
                    <div
                      key={block.id}
                      style={{ width: `${widthPercent}%` }}
                      className={`h-full px-1 flex items-center justify-center truncate transition-colors ${
                        isActive ? 'bg-indigo-600 font-bold' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      title={`${block.type}: ${block.label}`}
                    >
                      {block.type}
                    </div>
                  );
                })}
              </div>

              {/* Track 2: B-Roll & Visual Overlays */}
              <div className="h-4 rounded bg-slate-800 flex items-center px-1 text-[8px] font-mono text-amber-300">
                <span>B-Roll: Graphique Détection (00:38 - 00:52)</span>
              </div>

              {/* Track 3: Captions */}
              <div className="h-4 rounded bg-slate-800 flex items-center px-1 text-[8px] font-mono text-emerald-300">
                <span>Sous-titres ASS synchronisés ({clip.captionStyle})</span>
              </div>

              {/* Track 4: Audio Waveform & Normalization */}
              <div className="h-4 rounded bg-slate-800 flex items-center justify-between px-2 text-[8px] font-mono text-slate-400">
                <span>Master: -14.0 LUFS Normalized</span>
                <span>Ducking: -18dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
