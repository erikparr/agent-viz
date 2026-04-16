export type PipelineVisualKey =
  | "tts"
  | "alignment"
  | "phoneme-map"
  | "sampler-ui"
  | "synthesis";

export type PipelineStage = {
  num: string;
  title: string;
  signature: string;
  stack: string;
  visualKey: PipelineVisualKey;
  emphasize?: boolean;
};
