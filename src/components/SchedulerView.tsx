import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Share2,
  Plus,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Check,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { ScheduledPost, Clip } from '../types';

interface SchedulerViewProps {
  scheduledPosts: ScheduledPost[];
  clips: Clip[];
  onPublishNow: (scheduleId: string) => Promise<void>;
  onAddSchedule: (data: { clipId: string; scheduledTime: string; title: string; hashtags: string[] }) => void;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({
  scheduledPosts,
  clips,
  onPublishNow,
  onAddSchedule,
}) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedClipId, setSelectedClipId] = useState<string>(clips[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('18:00');
  const [customCaption, setCustomCaption] = useState<string>('');
  const [isAutoPlanning, setIsAutoPlanning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const primeSlots = ['12:00', '18:00', '21:00'];

  // Calculate 7 days for the current week view
  const getWeekDates = (offset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = (dayOfWeek + 6) % 7;
    startOfWeek.setDate(today.getDate() - distanceToMonday + offset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDates(currentWeekOffset);
  const monthLabel = weekDays[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const eligibleClips = clips.filter((c) => c.status === 'Approved' || c.status === 'Candidate');

  // Trigger Auto-Planner API
  const handleAutoPlan = async () => {
    setIsAutoPlanning(true);
    try {
      const res = await fetch('/api/scheduler/auto-plan', { method: 'POST' }).then((r) => r.json());
      if (res.success && res.data) {
        // Trigger page refresh / state update
        window.location.reload();
      }
    } catch (e) {
      console.error('Auto plan error:', e);
    } finally {
      setIsAutoPlanning(false);
    }
  };

  const handleManualSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClipId) return;

    const clip = clips.find((c) => c.id === selectedClipId);
    const scheduledTime = `${selectedDate}T${selectedTime}:00Z`;

    onAddSchedule({
      clipId: selectedClipId,
      scheduledTime,
      title: customCaption || clip?.title || 'Clip TikTok Programmé',
      hashtags: ['creatorrewards', 'clipforge', 'viral', 'growth'],
    });

    setIsModalOpen(false);
    setCustomCaption('');
  };

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    await onPublishNow(id);
    setPublishingId(null);
  };

  return (
    <div id="scheduler-calendar-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header with quick stats & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-slate-800" />
            <span>Planificateur & Calendrier TikTok</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organisation éditoriale synchronisée sur les créneaux algorithmiques prime (12h, 18h, 21h)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-auto-plan"
            onClick={handleAutoPlan}
            disabled={isAutoPlanning || eligibleClips.length === 0}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isAutoPlanning ? 'animate-spin' : ''}`} />
            <span>{isAutoPlanning ? 'Génération...' : 'Auto-Planifier la Semaine'}</span>
          </button>

          <button
            id="btn-open-schedule-modal"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Programmer un Clip</span>
          </button>
        </div>
      </div>

      {/* Week Navigation bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
            title="Semaine précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentWeekOffset(0)}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
            title="Semaine suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold capitalize text-slate-800 ml-2">{monthLabel}</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
            <span className="text-slate-600">Programmé ({scheduledPosts.filter((p) => p.status === 'SCHEDULED').length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Publié ({scheduledPosts.filter((p) => p.status === 'PUBLISHED').length})</span>
          </div>
        </div>
      </div>

      {/* Weekly Interactive Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, dayIndex) => {
          const dateStr = day.toISOString().split('T')[0];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;
          const dayName = day.toLocaleDateString('fr-FR', { weekday: 'short' });
          const dayNumber = day.getDate();

          const dayPosts = scheduledPosts.filter((p) => p.scheduledTime.startsWith(dateStr));

          return (
            <div
              key={dateStr}
              className={`bg-white rounded-xl border flex flex-col min-h-[380px] shadow-xs transition-colors ${
                isToday ? 'border-slate-800 ring-1 ring-slate-800/10' : 'border-slate-200'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3 border-b border-slate-100 flex items-center justify-between ${
                  isToday ? 'bg-slate-900 text-white rounded-t-[11px]' : 'bg-[#FAFAFA] text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider">{dayName}</span>
                  <span className={`text-xs font-mono font-bold ${isToday ? 'text-amber-300' : 'text-slate-900'}`}>
                    {dayNumber}
                  </span>
                </div>
                {dayPosts.length > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isToday ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {dayPosts.length}
                  </span>
                )}
              </div>

              {/* Day Content Area */}
              <div className="p-2.5 flex-1 flex flex-col gap-2 overflow-y-auto">
                {dayPosts.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-100 rounded-lg">
                    <span className="text-[11px] text-slate-400">Aucun post</span>
                    <button
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setIsModalOpen(true);
                      }}
                      className="mt-2 text-[10px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                ) : (
                  dayPosts.map((post) => {
                    const clip = clips.find((c) => c.id === post.clipId);
                    const timeOnly = post.scheduledTime.split('T')[1]?.slice(0, 5) || '18:00';
                    const isPublished = post.status === 'PUBLISHED';

                    return (
                      <div
                        key={post.id}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col gap-2 transition-all ${
                          isPublished
                            ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400'
                        }`}
                      >
                        {/* Time & Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {timeOnly}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                              isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isPublished ? 'Publié' : 'Programmé'}
                          </span>
                        </div>

                        {/* Title & Preview */}
                        <div className="flex items-start gap-2">
                          {clip && (
                            <img
                              src={clip.thumbnailUrl}
                              alt={clip.title}
                              className="w-8 h-12 object-cover rounded shrink-0 border border-slate-200"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-bold leading-snug line-clamp-2">{post.title}</h4>
                            {clip && (
                              <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                                {clip.duration}s • Viral {clip.viralScore}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          {!isPublished ? (
                            <button
                              onClick={() => handlePublish(post.id)}
                              disabled={publishingId === post.id}
                              className="text-[10px] font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>{publishingId === post.id ? 'Publication...' : 'Publier'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>TikTok OK</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-700" />
                <span>Programmer un Clip TikTok</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleManualSchedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sélectionner un Clip Éligible (≥60s)</label>
                <select
                  value={selectedClipId}
                  onChange={(e) => {
                    setSelectedClipId(e.target.value);
                    const c = clips.find((item) => item.id === e.target.value);
                    if (c) setCustomCaption(c.title);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-medium"
                >
                  {eligibleClips.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title.slice(0, 45)}... ({c.duration}s • Viral {c.viralScore})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Créneau Prime</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs font-bold"
                  >
                    {primeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} (Optimal)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre & Légende TikTok</label>
                <textarea
                  rows={2}
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Légende personnalisée..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  Confirmer la Programmation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
