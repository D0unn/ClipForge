export type VideoSourceType = 'file' | 'batch' | 'monitored' | 'youtube';

export type VideoStatus =
  | 'Imported'
  | 'Transcribing'
  | 'Analyzing'
  | 'Ready'
  | 'Processing'
  | 'Completed'
  | 'Error';

export type ClipStatus =
  | 'Candidate'
  | 'Selected'
  | 'Editing'
  | 'Rendered'
  | 'Approved'
  | 'Scheduled'
  | 'Published'
  | 'Rejected';

export type EditingStyle =
  | 'Podcast'
  | 'News'
  | 'Storytelling'
  | 'Debate'
  | 'Fast-paced';

export type CaptionPreset = 'Minimal' | 'Podcast' | 'Dynamic' | 'News' | 'Bold';

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  speaker: string;
  text: string;
  words?: WordTimestamp[];
}

export interface SemanticAnalysis {
  topics: string[];
  subtopics: string[];
  arguments: string[];
  emotionalPeaks: Array<{ timestamp: number; emotion: string; intensity: number }>;
  punchlines: Array<{ timestamp: number; quote: string; context: string }>;
  conflictInsights: Array<{ timestamp: number; description: string }>;
  summary: string;
}

export interface SourceVideo {
  id: string;
  title: string;
  filename: string;
  duration: number; // in seconds
  resolution: string;
  sizeMb: number;
  sourceUrl?: string;
  sourceType: VideoSourceType;
  importedAt: string;
  status: VideoStatus;
  thumbnail: string;
  speakerCount: number;
  transcript: TranscriptSegment[];
  semanticAnalysis?: SemanticAnalysis;
  detectedClipsCount: number;
}

export interface StoryStructure {
  hook: string;
  context: string;
  setup: string;
  development: string;
  conflictInsight: string;
  payoff: string;
  conclusion: string;
}

export interface HookVariant {
  id: string;
  type: 'question' | 'contradiction' | 'surprise' | 'chiffre' | 'problème' | 'promesse' | 'curiosité' | 'statement';
  text: string;
  viralPotential: number; // 0-100
  reasoning: string;
}

export interface EditDecisionBlock {
  id: string;
  startTime: number; // offset in clip
  endTime: number;
  duration: number;
  type: 'HOOK' | 'CONTEXT' | 'SETUP' | 'SOURCE_A' | 'SOURCE_B' | 'B_ROLL' | 'KEY_QUOTE' | 'CONCLUSION' | 'OVERLAY';
  label: string;
  transcriptSnippet?: string;
  captionPreset?: CaptionPreset;
  cropSetting: {
    speaker: string;
    focusPointXPercent: number; // 0-100 for 9:16 smart centering
    zoomLevel: number; // 1.0 - 1.4
  };
  bRollAsset?: {
    type: 'image' | 'video' | 'graphic' | 'stat';
    title: string;
    description: string;
    previewUrl: string;
  };
  audioFx?: string;
}

export interface QualityCheckItem {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  severity: 'critical' | 'warning' | 'pass';
}

export interface QualityReport {
  score: number;
  passedCount: number;
  totalChecks: number;
  checks: QualityCheckItem[];
  selfCritique: {
    strengths: string[];
    weaknesses: string[];
    improvementsMade: string[];
    critiqueIteration: number;
  };
}

export interface Clip {
  id: string;
  sourceId: string;
  sourceTitle: string;
  title: string;
  start: number; // in source video
  end: number;
  duration: number; // in seconds (must respect 60s-180s requirement for monetization)
  style: EditingStyle;
  status: ClipStatus;
  viralScore: number; // 0-100
  transformationScore: number; // 0-100
  qualityScore: number; // 0-100
  monetizationReadiness: number; // 0-100
  eligibleDuration: boolean; // >= 60s
  contextWindow: {
    optimalStart: number;
    optimalEnd: number;
    reasoning: string;
  };
  storyStructure: StoryStructure;
  hooks: HookVariant[];
  selectedHookIndex: number;
  editPlan: EditDecisionBlock[];
  qualityReport: QualityReport;
  captionStyle: CaptionPreset;
  audioSettings: {
    noiseReduction: boolean;
    voiceEnhancement: boolean;
    loudnessNorm: boolean;
    ducking: boolean;
  };
  thumbnailUrl: string;
  videoPreviewUrl: string;
  scheduledSlot?: {
    date: string;
    time: string;
    caption: string;
    hashtags: string[];
  };
  publishedData?: {
    tiktokVideoId: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    completionRate: number;
    avgWatchTimeSec: number;
    qualifiedViews: number;
    estimatedRewardUsd: number;
    publishedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductionBatchConfig {
  sourceIds: string[];
  targetCandidates: number;
  targetDurationRange: '60-75s' | '75-90s' | '90-120s' | '120-180s';
  styles: EditingStyle[];
  minViralScore: number;
  minQualityScore: number;
  minTransformationScore: number;
  maxFinalists: number;
}

export interface QueueJob {
  id: string;
  type:
    | 'TRANSCRIPTION'
    | 'SEMANTIC_ANALYSIS'
    | 'CLIP_DETECTION'
    | 'EDIT_BUILD'
    | 'SMART_CROP'
    | 'RENDER_VIDEO'
    | 'QUALITY_CHECK'
    | 'TIKTOK_PUBLISH';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  progress: number;
  currentStep: string;
  workerId: string;
  workerType: 'worker-ai' | 'worker-video' | 'scheduler';
  sourceId?: string;
  clipId?: string;
  logs: string[];
  retryCount: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface TikTokAccount {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isConnected: boolean;
  connectedAt?: string;
  permissions: string[];
  followersCount: number;
  totalViews: number;
  creatorRewardsEligible: boolean;
  autoPublishEnabled: boolean;
  defaultHashtags: string[];
}

export interface AnalyticsData {
  overview: {
    totalViews: number;
    qualifiedViews: number;
    averageViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalSaves: number;
    avgWatchTimeSec: number;
    avgCompletionRatePercent: number;
    estimatedRewardsTotal: number;
    currentEstimatedRpm: number;
  };
  history: Array<{
    date: string;
    views: number;
    qualifiedViews: number;
    rewards: number;
    completionRate: number;
  }>;
  efficiency: {
    productionHours: number;
    clipsProduced: number;
    clipsPublished: number;
    revenuePerProdHour: number;
  };
  learningInsights: Array<{
    id: string;
    category: 'HOOK' | 'STYLE' | 'DURATION' | 'TIME';
    title: string;
    observation: string;
    recommendation: string;
    confidence: number;
    impact: string;
  }>;
  experiments: Array<{
    id: string;
    name: string;
    variable: string;
    variants: Array<{
      name: string;
      clipsCount: number;
      avgViews: number;
      avgCompletion: number;
      avgRetention: number;
    }>;
    winner?: string;
  }>;
}

export interface SystemMonitoring {
  cpuUsagePercent: number;
  ramUsedGb: number;
  ramTotalGb: number;
  gpuName: string;
  vramUsedGb: number;
  vramTotalGb: number;
  gpuTempCelsius: number;
  cudaAvailable: boolean;
  storageUsedGb: number;
  storageTotalGb: number;
  activeWorkers: {
    ai: number;
    video: number;
    scheduler: number;
  };
  queueSummary: {
    active: number;
    queued: number;
    completed: number;
    failed: number;
  };
}

export interface ScheduledPost {
  id: string;
  clipId: string;
  title: string;
  scheduledTime: string;
  hashtags: string[];
  status: 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  publishedAt?: string;
  tiktokVideoId?: string;
  error?: string;
}
