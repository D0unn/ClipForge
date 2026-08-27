import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SourcesView } from './components/SourcesView';
import { ClipsView } from './components/ClipsView';
import { EditorView } from './components/EditorView';
import { ProductionView } from './components/ProductionView';
import { QueueView } from './components/QueueView';
import { SchedulerView } from './components/SchedulerView';
import { TikTokView } from './components/TikTokView';
import { AnalyticsView } from './components/AnalyticsView';
import { LearningView } from './components/LearningView';
import { SettingsView } from './components/SettingsView';
import { TranscriptModal } from './components/TranscriptModal';

import type {
  SourceVideo,
  Clip,
  QueueJob,
  ScheduledPost,
  AnalyticsData,
  TikTokAccount,
  SystemMonitoring,
  EditingStyle,
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [sources, setSources] = useState<SourceVideo[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [tikTokAccount, setTikTokAccount] = useState<TikTokAccount | null>(null);
  const [monitoring, setMonitoring] = useState<SystemMonitoring | null>(null);

  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [transcriptSource, setTranscriptSource] = useState<SourceVideo | null>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [sourcesRes, clipsRes, jobsRes, schedRes, analyticsRes, ttRes, monRes] =
        await Promise.all([
          fetch('/api/sources').then((r) => r.json()),
          fetch('/api/clips').then((r) => r.json()),
          fetch('/api/jobs').then((r) => r.json()),
          fetch('/api/scheduled').then((r) => r.json()),
          fetch('/api/analytics').then((r) => r.json()),
          fetch('/api/tiktok/account').then((r) => r.json()),
          fetch('/api/monitoring').then((r) => r.json()),
        ]);

      if (sourcesRes.success) setSources(sourcesRes.data);
      if (clipsRes.success) {
        setClips(clipsRes.data);
        if (!selectedClip && clipsRes.data.length > 0) {
          setSelectedClip(clipsRes.data[0]);
        }
      }
      if (jobsRes.success) setJobs(jobsRes.data);
      if (schedRes.success) setScheduledPosts(schedRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (ttRes.success) setTikTokAccount(ttRes.data);
      if (monRes.success) setMonitoring(monRes.data);
    } catch (e) {
      console.error('Error fetching initial data:', e);
    }
  };

  useEffect(() => {
    fetchData();
    // Live polling for jobs and monitoring every 2.5 seconds
    const interval = setInterval(async () => {
      try {
        const [jobsRes, monRes, clipsRes] = await Promise.all([
          fetch('/api/jobs').then((r) => r.json()),
          fetch('/api/monitoring').then((r) => r.json()),
          fetch('/api/clips').then((r) => r.json()),
        ]);
        if (jobsRes.success) setJobs(jobsRes.data);
        if (monRes.success) setMonitoring(monRes.data);
        if (clipsRes.success) {
          setClips(clipsRes.data);
          if (selectedClip) {
            const updated = clipsRes.data.find((c: Clip) => c.id === selectedClip.id);
            if (updated) setSelectedClip(updated);
          }
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Source Actions
  const handleImportSource = async (data: {
    title: string;
    filename: string;
    duration: number;
    sourceType: any;
    sourceUrl?: string;
  }) => {
    try {
      const res = await fetch('/api/sources/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (res.success) {
        setSources((prev) => [res.data, ...prev]);
        fetchData();
      }
    } catch (e) {
      console.error('Import failed:', e);
    }
  };

  const handleAnalyzeSource = async (sourceId: string) => {
    try {
      const res = await fetch(`/api/sources/${sourceId}/analyze`, {
        method: 'POST',
      }).then((r) => r.json());
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      console.error('Analysis failed:', e);
    }
  };

  const handleDetectClips = async (sourceId: string, durationRange: string) => {
    try {
      const res = await fetch(`/api/sources/${sourceId}/detect-clips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationRange }),
      }).then((r) => r.json());

      if (res.success) {
        await fetchData();
        setCurrentTab('clips');
      }
    } catch (e) {
      console.error('Detection failed:', e);
    }
  };

  // Clip Actions
  const handleSelectClipToEdit = (clip: Clip) => {
    setSelectedClip(clip);
    setCurrentTab('editor');
  };

  const handleUpdateClip = async (updated: Partial<Clip>) => {
    if (!selectedClip) return;
    const newClip = { ...selectedClip, ...updated };
    setSelectedClip(newClip);
    setClips((prev) => prev.map((c) => (c.id === newClip.id ? newClip : c)));

    try {
      await fetch(`/api/clips/${selectedClip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error('Clip update error:', e);
    }
  };

  const handleApproveClip = async (clipId: string) => {
    try {
      const res = await fetch(`/api/clips/${clipId}/approve`, {
        method: 'POST',
      }).then((r) => r.json());
      if (res.success) {
        setClips((prev) =>
          prev.map((c) => (c.id === clipId ? { ...c, status: 'Approved' } : c))
        );
        if (selectedClip?.id === clipId) {
          setSelectedClip((prev) => (prev ? { ...prev, status: 'Approved' } : null));
        }
      }
    } catch (e) {
      console.error('Approve failed:', e);
    }
  };

  const handleRejectClip = async (clipId: string) => {
    try {
      const res = await fetch(`/api/clips/${clipId}/reject`, {
        method: 'POST',
      }).then((r) => r.json());
      if (res.success) {
        setClips((prev) =>
          prev.map((c) => (c.id === clipId ? { ...c, status: 'Rejected' } : c))
        );
      }
    } catch (e) {
      console.error('Reject failed:', e);
    }
  };

  const handleCreateVariant = async (clipId: string, style: EditingStyle) => {
    try {
      const res = await fetch(`/api/clips/${clipId}/variant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style }),
      }).then((r) => r.json());
      if (res.success) {
        setClips((prev) => [res.data, ...prev]);
        setSelectedClip(res.data);
      }
    } catch (e) {
      console.error('Variant generation failed:', e);
    }
  };

  const handleRunCritique = async (clipId: string) => {
    try {
      const res = await fetch(`/api/clips/${clipId}/critique`, {
        method: 'POST',
      }).then((r) => r.json());
      if (res.success) {
        setSelectedClip(res.data);
        setClips((prev) => prev.map((c) => (c.id === clipId ? res.data : c)));
      }
    } catch (e) {
      console.error('Critique failed:', e);
    }
  };

  const handleScheduleClip = (clip: Clip) => {
    setSelectedClip(clip);
    setCurrentTab('scheduler');
  };

  // Production Batch Action
  const handleStartBatch = async (config: any) => {
    const res = await fetch('/api/production/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).then((r) => r.json());

    if (res.success) {
      await fetchData();
    }
  };

  // Queue Actions
  const handleRetryJob = async (jobId: string) => {
    await fetch(`/api/jobs/${jobId}/retry`, { method: 'POST' });
    fetchData();
  };

  const handleCancelJob = async (jobId: string) => {
    await fetch(`/api/jobs/${jobId}/cancel`, { method: 'POST' });
    fetchData();
  };

  // Scheduler Actions
  const handleAddSchedule = async (data: {
    clipId: string;
    scheduledTime: string;
    title: string;
    hashtags: string[];
  }) => {
    const res = await fetch('/api/scheduler/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json());

    if (res.success) {
      setScheduledPosts((prev) => [res.data, ...prev]);
      fetchData();
    }
  };

  const handlePublishNow = async (scheduleId: string) => {
    await fetch(`/api/scheduler/${scheduleId}/publish-now`, { method: 'POST' });
    fetchData();
  };

  // TikTok Connect
  const handleConnectTikTok = async () => {
    const res = await fetch('/api/tiktok/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'sample_oauth_code_tiktok' }),
    }).then((r) => r.json());

    if (res.success) {
      setTikTokAccount(res.data);
    }
  };

  const activeJobsCount = jobs.filter(
    (j) => j.status === 'PROCESSING' || j.status === 'QUEUED'
  ).length;

  return (
    <div className="flex h-screen bg-[#FBFBF9] text-[#121316] overflow-hidden font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        badgeCounts={{
          sources: sources.length,
          candidates: clips.filter((c) => c.status === 'Candidate').length,
          approved: clips.filter((c) => c.status === 'Approved').length,
          scheduled: scheduledPosts.length,
          queue: activeJobsCount,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          monitoring={monitoring}
          tikTokAccount={tikTokAccount}
          activeJobsCount={activeJobsCount}
          onOpenQueue={() => setCurrentTab('queue')}
          onOpenTikTok={() => setCurrentTab('tiktok')}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              sources={sources}
              clips={clips}
              analytics={analytics}
              monitoring={monitoring}
              jobs={jobs}
              onSelectClip={handleSelectClipToEdit}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'sources' && (
            <SourcesView
              sources={sources}
              onImportSource={handleImportSource}
              onAnalyzeSource={handleAnalyzeSource}
              onDetectClips={handleDetectClips}
              onViewTranscript={(src) => setTranscriptSource(src)}
            />
          )}

          {currentTab === 'clips' && (
            <ClipsView
              clips={clips}
              onSelectClip={handleSelectClipToEdit}
              onApproveClip={handleApproveClip}
              onRejectClip={handleRejectClip}
              onCreateVariant={handleCreateVariant}
              onRunCritique={handleRunCritique}
              onScheduleClip={handleScheduleClip}
            />
          )}

          {currentTab === 'editor' && (
            <EditorView
              clip={selectedClip}
              onUpdateClip={handleUpdateClip}
              onRunCritique={handleRunCritique}
              onCreateVariant={handleCreateVariant}
              onApproveClip={handleApproveClip}
              onScheduleClip={handleScheduleClip}
            />
          )}

          {currentTab === 'production' && (
            <ProductionView sources={sources} onStartBatch={handleStartBatch} />
          )}

          {currentTab === 'queue' && (
            <QueueView
              jobs={jobs}
              monitoring={monitoring}
              onRetryJob={handleRetryJob}
              onCancelJob={handleCancelJob}
            />
          )}

          {currentTab === 'scheduler' && (
            <SchedulerView
              scheduledPosts={scheduledPosts}
              clips={clips}
              onPublishNow={handlePublishNow}
              onAddSchedule={handleAddSchedule}
            />
          )}

          {currentTab === 'tiktok' && (
            <TikTokView account={tikTokAccount} onConnectOAuth={handleConnectTikTok} />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView analytics={analytics} clips={clips} />
          )}

          {currentTab === 'learning' && <LearningView analytics={analytics} />}

          {currentTab === 'settings' && <SettingsView monitoring={monitoring} />}
        </main>
      </div>

      {/* Transcript Modal */}
      <TranscriptModal
        source={transcriptSource}
        onClose={() => setTranscriptSource(null)}
      />
    </div>
  );
}
