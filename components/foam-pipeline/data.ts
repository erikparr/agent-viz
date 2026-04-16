import type { PipelineStage } from "./types";

export const FOAM_STAGES: PipelineStage[] = [
  {
    num: "01",
    title: "TTS Generation",
    signature: "text → speech waveform",
    stack: "React · FastAPI · ElevenLabs",
    visualKey: "tts",
  },
  {
    num: "02",
    title: "Forced Alignment · MFA",
    signature: "waveform + transcript → phoneme timings",
    stack: "Montreal Forced Aligner · ARPAbet",
    visualKey: "alignment",
  },
  {
    num: "03",
    title: "Phoneme Mapping",
    signature: "timings → indexed phoneme bundle",
    stack: "Python · G2P · t-SNE",
    visualKey: "phoneme-map",
  },
  {
    num: "04",
    title: "UI · Web + VST",
    signature: "bundle → filterable, triggerable",
    stack: "React · Zustand · JUCE 8",
    visualKey: "sampler-ui",
  },
  {
    num: "05",
    title: "Audio Synthesis",
    signature: "trigger → polyphonic playback",
    stack: "JUCE DSP · Polyphonic Voice Pool",
    visualKey: "synthesis",
    emphasize: true,
  },
];

export const CONNECTOR_ANNOTATIONS: Record<number, string> = {
  3: ".phonemebundle",
};
