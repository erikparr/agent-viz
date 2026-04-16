"use client";

import type { ReactElement } from "react";
import { FOAM_STAGES, CONNECTOR_ANNOTATIONS } from "./data";
import type { PipelineVisualKey } from "./types";
import { PipelineStageCard, StageConnector } from "./PipelineStage";
import {
  AlignmentVisual,
  PhonemeMapVisual,
  SamplerUiVisual,
  SynthesisVisual,
  TtsVisual,
} from "./visuals";

const VISUALS: Record<PipelineVisualKey, () => ReactElement> = {
  tts: TtsVisual,
  alignment: AlignmentVisual,
  "phoneme-map": PhonemeMapVisual,
  "sampler-ui": SamplerUiVisual,
  synthesis: SynthesisVisual,
};

export function FoamPipeline() {
  return (
    <section className="foam-pipeline border-t border-border-muted pt-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-border-accent">
          Pipeline · text → sample
        </h3>
        <span className="font-mono text-[10px] tabular-nums text-text-secondary">
          {FOAM_STAGES.length} stages
        </span>
      </div>

      <div className="flex flex-col items-stretch">
        {FOAM_STAGES.map((stage, i) => {
          const Visual = VISUALS[stage.visualKey];
          return (
            <div key={stage.num} className="flex flex-col items-stretch">
              <PipelineStageCard stage={stage} visual={<Visual />} />
              {i < FOAM_STAGES.length - 1 && (
                <StageConnector annotation={CONNECTOR_ANNOTATIONS[i]} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
