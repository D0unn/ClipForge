import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  Flame,
  ShieldCheck,
  Key,
  ExternalLink,
  Users,
  Eye,
  RefreshCw,
  Lock,
  Zap,
} from 'lucide-react';
import type { TikTokAccount } from '../types';

interface TikTokViewProps {
  account: TikTokAccount | null;
  onConnectOAuth: () => Promise<void>;
}

export const TikTokView: React.FC<TikTokViewProps> = ({ account, onConnectOAuth }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await onConnectOAuth();
    setIsConnecting(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#121316]">
            Intégration Officielle TikTok
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connexion sécurisée OAuth 2.0 TikTok Creator API & Éligibilité au Programme de Récompenses
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>API Officielle Validée</span>
          </span>
        </div>
      </div>

      {/* Account Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAEAE5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={account?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-900 shadow-xs"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">{account?.displayName || 'Compte TikTok'}</h3>
                <span className="text-xs font-mono text-slate-500">@{account?.username || 'user'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-slate-500">
                Identifiant Créateur : <code className="font-mono text-slate-700">{account?.id || 'tiktok-acc-01'}</code>
              </p>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
            <span>{isConnecting ? 'Authentification...' : 'Reconnecter OAuth'}</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div className="p-4 bg-[#F9F9F7] rounded-xl">
            <span className="text-xs text-slate-500 font-medium">Abonnés Actifs</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {account?.followersCount.toLocaleString() ?? '142,500'}
            </div>
          </div>

          <div className="p-4 bg-[#F9F9F7] rounded-xl">
            <span className="text-xs text-slate-500 font-medium">Vues Totales 30j</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {account?.totalViewsCount.toLocaleString() ?? '3,840,000'}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-1 text-amber-900 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Creator Rewards Status</span>
            </div>
            <div className="text-xl font-extrabold text-amber-950 mt-1">ÉLIGIBLE & ACTIF</div>
          </div>
        </div>

        {/* Permissions & Scopes Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Permissions Déclarées & Validées par TikTok API
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {account?.scopesGranted.map((scope, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <code className="font-mono text-slate-800 font-bold">{scope}</code>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Accordé
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Account Scalability Notice */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAEAE5] shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Architecture Multi-Comptes (Étape Suivante)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Le premier compte est configuré comme compte de référence. Une fois validé, vous pourrez connecter jusqu'à 20 comptes TikTok supplémentaires avec des profils éditoriaux dédiés (Finance, Tech, Lifestyle, Éducation).
        </p>
      </div>
    </div>
  );
};
