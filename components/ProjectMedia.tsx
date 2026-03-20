"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/lib/portfolioData";

var FoamLogo3D = dynamic(
  () => import("./FoamLogo3D").then((mod) => mod.FoamLogo3D),
  { ssr: false, loading: () => <div className="w-full h-full bg-bg-primary flex items-center justify-center text-text-secondary text-xs">Loading 3D...</div> }
);

interface ProjectMediaProps {
  project: Project;
  className?: string;
}

export function ProjectMedia({ project, className = "" }: ProjectMediaProps) {
  if (project.mediaType === "foam3d") {
    return (
      <div className={`relative overflow-hidden bg-bg-primary ${className}`}>
        <FoamLogo3D />
      </div>
    );
  }

  if (project.mediaType === "vimeo") {
    return (
      <div className={`relative overflow-hidden bg-bg-surface ${className}`}>
        <iframe
          src={`${project.mediaContent as string}?background=1&autoplay=1&loop=1&muted=1`}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          title={project.title}
        />
      </div>
    );
  }

  // Image type — handle single or array
  var src = Array.isArray(project.mediaContent)
    ? project.mediaContent[0]
    : project.mediaContent;

  return (
    <div className={`relative overflow-hidden bg-bg-surface ${className}`}>
      <img
        src={src}
        alt={project.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
