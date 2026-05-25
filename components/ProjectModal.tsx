"use client";

import { Modal } from "./ui/Modal";
import { ButtonLink } from "./ui/Button";
import { ProjectMedia } from "./ProjectMedia";
import { FoamPipeline } from "./foam-pipeline/FoamPipeline";
import type { Project } from "@/lib/portfolioData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <Modal
      open={project !== null}
      onClose={onClose}
      title="Project Detail"
      size="xl"
      scrollable
    >
      {project && (
        <>
          <ProjectMedia
            project={project}
            className={`border border-border-muted ${
              project.mediaType === "foam3d"
                ? "aspect-[16/9] min-h-[300px]"
                : "aspect-video"
            }`}
          />

          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            {project.title}
          </h2>

          {project.mediaType === "essay" ? (
            <div className="text-[11px] italic text-text-secondary tracking-wide">
              by Erik Parr
            </div>
          ) : (
            <div className="text-xs text-text-secondary">
              <span className="text-border-accent">roles:</span>{" "}
              {project.roles.join(", ")}
            </div>
          )}

          <p className="text-xs leading-relaxed text-text-primary">
            {project.description}
          </p>

          {project.id === "foam" && <FoamPipeline />}

          {project.details && (
            <div className="space-y-0">
              {project.details.map((detail) => (
                <div
                  key={detail.heading}
                  className="border-t border-border-muted pt-3 mt-3"
                >
                  <h3 className="text-[10px] font-bold text-border-accent uppercase tracking-wide mb-1.5">
                    {detail.heading}
                  </h3>
                  <p className="text-xs leading-relaxed text-text-primary">
                    {detail.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-[10px] px-2 py-1 border border-border-muted text-text-secondary"
                >
                  {cat}
                </span>
              ))}
            </div>

            {project.link && (
              <ButtonLink
                href={project.link}
                external
                variant="ghost"
                size="sm"
                className="text-step-tool shrink-0 hover:underline hover:text-step-tool"
              >
                [view project]
              </ButtonLink>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
