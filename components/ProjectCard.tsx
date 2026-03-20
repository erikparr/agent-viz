"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/portfolioData";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
      className="cursor-pointer group focus-visible:outline-none"
    >
      <div className="border border-border-muted hover:border-border-accent focus-visible:border-border-accent transition-colors">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-bg-surface">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <h3 className="text-xs font-bold text-text-primary">{project.title}</h3>

          <p className="text-[10px] leading-relaxed text-text-secondary line-clamp-2">
            {project.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="text-[9px] px-1.5 py-0.5 border border-border-muted text-text-secondary"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
