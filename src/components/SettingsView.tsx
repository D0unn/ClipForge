import React, { useState, useEffect } from 'react';
import {
  Settings,
  HardDrive,
  Cpu,
  Activity,
  Download,
  Copy,
  Check,
  Terminal,
  FileCode,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import type { SystemMonitoring } from '../types';

interface SettingsViewProps {
  monitoring: SystemMonitoring | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ monitoring }) => {
  const [dockerFiles, setDockerFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>('docker-compose.yml');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/docker/files')
      .then((res) => res.json())
      .then((data) => {
        if (data.dockerCompose) {
          setDockerFiles({
            'docker-compose.yml': data.dockerCompose,
            'Dockerfile.api': data.dockerfileApi || '',
            'Dockerfile.worker': data.dockerfileWorker || '',
            'Dockerfile.frontend': data.dockerfileFrontend || '',
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = () => {
    if (dockerFiles[selectedFile]) {
      navigator.clipboard.writeText(dockerFiles[selectedFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="settings-view" className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Paramètres Système & Monitoring GPU
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            État de l'accélération matérielle locale NVIDIA, répertoires et manifestes de déploiement
          </p>
        </div>
      </div>

      {/* Hardware Monitoring Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">GPU Principal</span>
            <Activity className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {monitoring?.gpuName || 'NVIDIA RTX 4090'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>CUDA 12.4</span>
            <span>•</span>
            <span>NVENC 8x</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">VRAM Utilisée</span>
            <Cpu className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-sm font-bold text-slate-900">
            {monitoring ? `${monitoring.vramUsedGb} / ${monitoring.vramTotalGb} GB` : '8.4 / 24.0 GB'}
          </div>
          <div className="text-[11px] text-slate-500">
            Température : {monitoring?.gpuTempCelsius || 58}°C
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Charge CPU</span>
            <Cpu className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-sm font-bold text-slate-900">
            {monitoring?.cpuUsagePercent ?? 28}%
          </div>
          <div className="text-[11px] text-slate-500">
            RAM : {monitoring?.ramUsedGb || 11.4} / {monitoring?.ramTotalGb || 32} GB
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Stockage Local</span>
            <HardDrive className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-sm font-bold text-slate-900">
            {monitoring?.storageUsedGb || 142.5} GB
          </div>
          <div className="text-[11px] text-slate-500">
            Sur SSD NVMe 1.0 TB
          </div>
        </div>
      </div>

      {/* Local Folder Config */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Répertoires Locaux Configurés
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Dossier Surveillé (Watch)</span>
            <code className="font-mono text-slate-900 font-semibold text-xs">/Volumes/SSD/ClipForge_Watch</code>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Dossier Rendus Finaux</span>
            <code className="font-mono text-slate-900 font-semibold text-xs">/Volumes/SSD/ClipForge_Output</code>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold block text-[11px]">Cache Whisper & B-Roll</span>
            <code className="font-mono text-slate-900 font-semibold text-xs">/Volumes/SSD/ClipForge_Cache</code>
          </div>
        </div>
      </div>

      {/* Docker Export Center */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-slate-700" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Fichiers Docker & Déploiement Local
              </h3>
              <p className="text-[11px] text-slate-500">
                Configuration multi-conteneurs pour exécution autonome avec accélération GPU
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>

        {/* File Tabs */}
        {Object.keys(dockerFiles).length > 0 && (
          <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50 overflow-x-auto">
            {Object.keys(dockerFiles).map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={`px-3 py-2 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer ${
                  selectedFile === filename
                    ? 'border-slate-900 text-slate-900 bg-white font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {filename}
              </button>
            ))}
          </div>
        )}

        {/* Code Viewer */}
        <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[380px]">
          <pre className="leading-relaxed whitespace-pre">
            {dockerFiles[selectedFile] || 'docker-compose.yml'}
          </pre>
        </div>
      </div>
    </div>
  );
};
