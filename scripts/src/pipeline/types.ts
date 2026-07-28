export type PipelineStage = "preflight" | "build" | "verify" | "publish";

export interface PipelineEpisode {
  id: number;
  epNumber: number;
  status: string;
  hookTitle: string;
  youtubeVideoId: string | null;
  scheduledPublishAt: Date | null;
}

export interface BuildArtifact {
  episode: number;
  exportDir: string;
  videoPath: string;
  videoBytes: number;
}

export interface PipelineResult {
  episode: number;
  stages: PipelineStage[];
  artifact?: BuildArtifact;
  published?: boolean;
}