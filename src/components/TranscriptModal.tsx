import React from 'react';
import { X, Mic, Sparkles, Clock, MessageSquare } from 'lucide-react';
import type { SourceVideo } from '../types';

interface TranscriptModalProps {
  source: SourceVideo | null;
  onClose: () => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl border border-[#EAEAE5] shadow-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EAEAE5] flex items-center justify-between bg-[#FBFBF9]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{source.title}</h3>
              <p className="text-[11px] text-slate-500">
                Transcription Whisper-Large-v3 • {source.transcript.length} segments • {source.speakerCount} Intervenants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Semantic Overview Bar */}
        {source.semanticAnalysis && (
          <div className="p-4 bg-slate-50 border-b border-[#EAEAE5] space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">Synthèse Sémantique IA :</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{source.semanticAnalysis.summary}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {source.semanticAnalysis.topics.map((topic, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Segments Stream */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {source.transcript.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Aucune transcription extraite pour le moment.
            </div>
          ) : (
            source.transcript.map((seg) => (
              <div key={seg.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>{seg.speaker}</span>
                  </span>
                  <span className="font-mono text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>
                      {new Date(seg.startTime * 1000).toISOString().slice(14, 19)} –{' '}
                      {new Date(seg.endTime * 1000).toISOString().slice(14, 19)}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed pl-3.5 border-l-2 border-slate-200">
                  "{seg.text}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EAEAE5] bg-[#FBFBF9] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all"
          >
            Fermer la Transcription
          </button>
        </div>
      </div>
    </div>
  );
};
