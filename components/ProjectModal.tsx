"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";
import { ProjectMedia } from "./ProjectMedia";
import type { Project } from "@/lib/portfolioData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  var handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (project) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, handleKeyDown]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <TerminalChrome title="Project Detail">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="text-xs text-text-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none"
                  >
                    [close]
                  </button>
                </div>

                <ProjectMedia
                  project={project}
                  className={`border border-border-muted ${project.mediaType === "foam3d" ? "aspect-[16/9] min-h-[300px]" : "aspect-video"}`}
                />

                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  {project.title}
                </h2>

                <div className="text-xs text-text-secondary">
                  <span className="text-border-accent">roles:</span>{" "}
                  {project.roles.join(", ")}
                </div>

                <p className="text-xs leading-relaxed text-text-primary">
                  {project.description}
                </p>

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
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-step-tool hover:underline shrink-0 focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none"
                    >
                      [view project]
                    </a>
                  )}
                </div>
              </div>
            </TerminalChrome>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
