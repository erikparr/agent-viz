"use client";

import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal";
import { Button, ButtonLink } from "./ui/Button";
import { ProjectMedia } from "./ProjectMedia";
import { FoamPipeline } from "./foam-pipeline/FoamPipeline";
import type { Project } from "@/lib/portfolioData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  var [copied, setCopied] = useState(false);

  // Reset the "copied" affordance whenever a different project opens
  useEffect(() => setCopied(false), [project?.id]);

  function copyLink() {
    if (!project) return;
    var url = `${window.location.origin}/?project=${project.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

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

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyLink}
                aria-label="Copy shareable link to this project"
              >
                {copied ? "[link copied]" : "[copy link]"}
              </Button>
              {project.link && (
                <ButtonLink
                  href={project.link}
                  external
                  variant="ghost"
                  size="sm"
                  className="text-step-tool hover:underline hover:text-step-tool"
                >
                  [view project]
                </ButtonLink>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
