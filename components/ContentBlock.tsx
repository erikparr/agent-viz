"use client";

import { motion } from "framer-motion";
import type { ContentBlock as ContentBlockType } from "@/lib/contentData";

interface ContentBlockProps {
  block: ContentBlockType;
}

export function ContentBlock({ block }: ContentBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-3"
    >
      {block.sections.map((section) => (
        <div key={section.heading}>
          <h4 className="text-xs font-bold text-text-primary mb-1.5">
            {section.heading}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item, i) => (
              <li key={i} className="text-[10px] leading-relaxed text-text-secondary flex gap-2">
                <span className="text-border-accent shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {block.closing && (
        <p className="text-[10px] leading-relaxed text-text-secondary border-t border-border-muted pt-3 mt-3">
          {block.closing}
        </p>
      )}
    </motion.div>
  );
}
