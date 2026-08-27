import React, { useState } from 'react';
import {
  ListTodo,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  XCircle,
  Terminal,
  Activity,
  Sparkles,
  Film,
  Zap,
} from 'lucide-react';
import type { QueueJob, SystemMonitoring } from '../types';

interface QueueViewProps {
  jobs: QueueJob[];
  monitoring: SystemMonitoring | null;
  onRetryJob: (jobId: string) => void;
  onCancelJob: (jobId: string) => void;
}

export const QueueView: React.FC<QueueViewProps> = ({
  jobs,
  monitoring,
  onRetryJob,
  onCancelJob,
}) => {
  const [selectedJob, setSelectedJob] = useState<QueueJob | null>(null);

  const activeJobs = jobs.filter((j) => j.status === 'PROCESSING' || j.status === 'QUEUED');
  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED');
  const failedJobs = jobs.filter((j) => j.status === 'FAILED');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Gestionnaire de Queue & Workers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Orchestration locale asynchrone Redis + Workers Découpe IA & Rendu Vidéo GPU (FFmpeg NVENC)
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {activeJobs.length} En cours
          </span>
          <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {completedJobs.length} Terminés
          </span>
          {failedJobs.length > 0 && (
            <span className="px-2.5 py-1 rounded-full font-bold bg-red-50 text-red-800 border border-red-200">
              {failedJobs.length} Échecs
            </span>
          )}
        </div>
      </div>

      {/* Workers Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Worker Pool 1: IA Gemini & Whisper */}
        <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Worker Pool A: IA & Whisper
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              2 Workers Actifs
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Traitement Whisper-Large-v3 local + Analyse Sémantique Gemini 2.5 Flash
          </p>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-700">
            <span>Tâches traitées aujourd'hui :</span>
            <span className="font-bold">48 tâches</span>
          </div>
        </div>

        {/* Worker Pool 2: Video NVENC & Audio FFmpeg */}
        <div className="bg-white p-5 rounded-xl border border-[#EAEAE5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Worker Pool B: Rendu Vidéo GPU
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              3 Workers Actifs (NVENC)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            FFmpeg 7.0 h264_nvenc (4K/1080p 60fps) + Cadrage Intelligent 9:16 + Mastering EBU R128
          </p>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-700">
            <span>Vitesse moyenne de rendu :</span>
            <span className="font-bold text-emerald-700">8.4x Temps Réel</span>
          </div>
        </div>
      </div>

      {/* Jobs Table & Logs Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Jobs List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#EAEAE5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EAEAE5] flex items-center justify-between bg-[#FBFBF9]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Tâches dans la Queue Redis ({jobs.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Ordre de priorité FIFO</span>
          </div>

          <div className="divide-y divide-[#EAEAE5] max-h-[520px] overflow-y-auto">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 transition-colors cursor-pointer space-y-2.5 ${
                  selectedJob?.id === job.id ? 'bg-[#F9F9F7]' : 'hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{job.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {job.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {job.workerAssigned || 'Worker en attente'}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-800'
                        : job.status === 'PROCESSING'
                        ? 'bg-amber-50 text-amber-800 animate-pulse'
                        : job.status === 'FAILED'
                        ? 'bg-red-50 text-red-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.status === 'PROCESSING' ? `${job.progressPercent}%` : job.status}
                  </span>
                </div>

                {/* Progress bar */}
                {job.status === 'PROCESSING' && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full transition-all duration-300"
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>
                )}

                {/* Last log snippet */}
                <div className="text-[11px] text-slate-500 font-mono truncate">
                  {job.logs[job.logs.length - 1] || 'Initialisation du pipeline...'}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[10px] text-slate-400">
                    Créé à {new Date(job.createdAt).toLocaleTimeString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {job.status === 'FAILED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRetryJob(job.id);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[10px] flex items-center space-x-1 cursor-pointer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Relancer</span>
                      </button>
                    )}
                    {job.status === 'PROCESSING' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelJob(job.id);
                        }}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded font-semibold text-[10px] flex items-center space-x-1 cursor-pointer"
                      >
                        <XCircle className="w-2.5 h-2.5" />
                        <span>Annuler</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Terminal Logs Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-xl p-5 shadow-xs border border-slate-800 flex flex-col justify-between h-[580px] font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">
                Logs Worker: {selectedJob ? selectedJob.id : 'Sélectionnez une tâche'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Flux en direct</span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-1.5 text-[11px] text-slate-300">
            {selectedJob ? (
              selectedJob.logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-emerald-400 mr-2">&gt;</span>
                  <span>{log}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 py-16 text-center">
                Cliquez sur une tâche à gauche pour inspecter ses logs d'exécution FFmpeg / IA en temps réel.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
            <span>GPU Driver 550.54.14 • CUDA 12.4</span>
            <span className="text-emerald-400 font-bold">NVENC READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
