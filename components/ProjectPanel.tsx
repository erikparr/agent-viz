"use client";

import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";
import { ProjectCard } from "./ProjectCard";
import { PROJECTS } from "@/lib/portfolioData";
import type { AgentRun } from "@/lib/types";

interface ProjectPanelProps {
  run: AgentRun;
}

export function ProjectPanel({ run }: ProjectPanelProps) {
  var projectIds = useMemo(() => {
    var seen = new Set<string>();
    var ids: string[] = [];
    for (var step of run.steps) {
      if (step.projectRefs) {
        for (var ref of step.projectRefs) {
          if (!seen.has(ref) && PROJECTS[ref]) {
            seen.add(ref);
            ids.push(ref);
          }
        }
      }
    }
    return ids;
  }, [run.steps]);

  if (projectIds.length === 0) return null;

  return (
    <TerminalChrome title="Projects">
      <div className="space-y-3 max-h-[80vh] overflow-y-auto">
        <AnimatePresence>
          {projectIds.map((id) => (
            <ProjectCard key={id} project={PROJECTS[id]} />
          ))}
        </AnimatePresence>
      </div>
    </TerminalChrome>
  );
}
