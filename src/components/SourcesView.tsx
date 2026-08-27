import React, { useState } from 'react';
import {
  UploadCloud,
  Film,
  Sparkles,
  FolderOpen,
  Link,
  Plus,
  Play,
  FileText,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Trash2,
  Zap,
} from 'lucide-react';
import type { SourceVideo } from '../types';

interface SourcesViewProps {
  sources: SourceVideo[];
  onImportSource: (data: { title: string; filename: string; duration: number; sourceType: any; sourceUrl?: string }) => void;
  onAnalyzeSource: (sourceId: string) => void;
  onDetectClips: (sourceId: string, durationRange: string) => void;
  onViewTranscript: (source: SourceVideo) => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  sources,
  onImportSource,
  onAnalyzeSource,
  onDetectClips,
  onViewTranscript,
}) => {
  const [importTab, setImportTab] = useState<'file' | 'batch' | 'monitored' | 'youtube'>('file');
  const [titleInput, setTitleInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [durationInput, setDurationInput] = useState(1800);
  const [targetDurationRange, setTargetDurationRange] = useState('75-90s');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importTab === 'youtube' && !youtubeUrl) return;
    
    const finalTitle = titleInput || (importTab === 'youtube' ? 'Interview YouTube Long-Format' : 'Podcast Épisode Enregistré');
    const finalFilename = importTab === 'youtube' ? 'yt_stream_capture.mp4' : 'source_recording_studio.mp4';

    onImportSource({
      title: finalTitle,
      filename: finalFilename,
      duration: durationInput,
      sourceType: importTab,
      sourceUrl: youtubeUrl,
    });

    setTitleInput('');
    setYoutubeUrl('');
  };

  const handleTriggerDetect = async (sourceId: string) => {
    setProcessingId(sourceId);
    await onDetectClips(sourceId, targetDurationRange);
    setProcessingId(null);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Sources Vidéos & Transcriptions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Importez des podcasts, interviews et masterclasses longues pour extraction automatisée Whisper + Gemini
          </p>
        </div>
      </div>

      {/* Import Box */}
      <div className="bg-white p-6 rounded-xl border border-[#EAEAE5] shadow-xs space-y-5">
        <div className="flex items-center space-x-2 border-b border-[#EAEAE5] pb-3">
          <button
            onClick={() => setImportTab('file')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              importTab === 'file' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Fichier Unique</span>
          </button>
          <button
            onClick={() => setImportTab('batch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              importTab === 'batch' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Import Multiple (Batch)</span>
          </button>
          <button
            onClick={() => setImportTab('monitored')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              importTab === 'monitored' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Dossier Surveillé (/watch_folder)</span>
          </button>
          <button
            onClick={() => setImportTab('youtube')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              importTab === 'youtube' ? 'bg-[#0F172A] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>URL Vidéo Autorisée</span>
          </button>
        </div>

        <form onSubmit={handleImportSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Titre de la vidéo source
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Ex: Masterclass Neuro-IA & Business 2026..."
                className="w-full px-3 py-2 text-xs border border-[#EAEAE5] rounded-lg bg-[#FBFBF9] focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Durée estimée (minutes)
              </label>
              <input
                type="number"
                value={durationInput / 60}
                onChange={(e) => setDurationInput(Number(e.target.value) * 60)}
                className="w-full px-3 py-2 text-xs border border-[#EAEAE5] rounded-lg bg-[#FBFBF9] focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {importTab === 'youtube' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL YouTube (droits & autorisations requis)
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 text-xs border border-[#EAEAE5] rounded-lg bg-[#FBFBF9] focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>
          )}

          {importTab === 'monitored' && (
            <div className="p-3 bg-[#F9F9F7] rounded-lg border border-[#EAEAE5] text-xs text-slate-600">
              Dossier local surveillé : <code className="font-mono text-slate-900 font-bold">/Volumes/SSD_Media/ClipForge_Watch</code>. Tout fichier MP4/MOV déposé sera automatiquement transcrit par Whisper.
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Importer & Lancer la Transcription</span>
            </button>
          </div>
        </form>
      </div>

      {/* Target Duration Selector for AI Detection */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#EAEAE5] shadow-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-slate-700" />
          <div>
            <span className="text-xs font-bold text-slate-900">Durée Cible Creator Rewards</span>
            <p className="text-[11px] text-slate-500">
              Seules les découpes avec structure narrative complète &ge; 60 secondes sont générées.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {['60-75s', '75-90s', '90-120s', '120-180s'].map((range) => (
            <button
              key={range}
              onClick={() => setTargetDurationRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

      {/* Sources List Table */}
      <div className="bg-white rounded-xl border border-[#EAEAE5] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#EAEAE5] flex items-center justify-between bg-[#FBFBF9]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Vidéos Sources dans l'Usine ({sources.length})
          </h3>
          <span className="text-xs text-slate-500">Extraction Whisper + Cadrage Intelligent 9:16</span>
        </div>

        <div className="divide-y divide-[#EAEAE5]">
          {sources.map((source) => (
            <div key={source.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-xs">
                  <img
                    src={source.thumbnail}
                    alt={source.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-white text-[9px] font-mono rounded">
                    {Math.floor(source.duration / 60)} min
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400">{source.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      source.status === 'Ready'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : source.status === 'Analyzing' || source.status === 'Transcribing'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {source.status === 'Ready' ? 'Prêt pour Découpe' : source.status}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {source.speakerCount} Speakers détectés
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{source.title}</h4>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                    <span>{source.resolution}</span>
                    <span>•</span>
                    <span>{source.sizeMb} MB</span>
                    <span>•</span>
                    <span>{source.filename}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 self-end lg:self-center shrink-0">
                <button
                  onClick={() => onViewTranscript(source)}
                  className="px-3 py-1.5 bg-[#F9F9F7] hover:bg-slate-200 text-slate-800 border border-[#EAEAE5] rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Transcription Whisper</span>
                </button>

                <button
                  onClick={() => onAnalyzeSource(source.id)}
                  className="px-3 py-1.5 bg-[#F9F9F7] hover:bg-slate-200 text-slate-800 border border-[#EAEAE5] rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                  <span>Compréhension IA</span>
                </button>

                <button
                  onClick={() => handleTriggerDetect(source.id)}
                  disabled={processingId === source.id}
                  className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-60 shadow-xs"
                >
                  {processingId === source.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Découpage en cours...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Détecter Clips 9:16 ({targetDurationRange})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
