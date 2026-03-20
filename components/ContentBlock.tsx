"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContentBlock as ContentBlockType, ContentSection } from "@/lib/contentData";

function SectionList({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="space-y-3">
      {sections.map((section) => (
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
    </div>
  );
}

interface ContentBlockProps {
  block: ContentBlockType;
}

export function ContentBlock({ block }: ContentBlockProps) {
  var [activeTab, setActiveTab] = useState(0);

  // Tabbed content
  if (block.tabs && block.tabs.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-3"
      >
        {/* Tab buttons */}
        <div className="flex gap-1 flex-wrap">
          {block.tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`text-[10px] px-2.5 py-1.5 border transition-colors focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none ${
                activeTab === i
                  ? "border-border-accent text-text-primary bg-bg-elevated"
                  : "border-border-muted text-text-secondary hover:border-border-accent hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <SectionList sections={block.tabs[activeTab].sections} />
          </motion.div>
        </AnimatePresence>

        {block.closing && (
          <p className="text-[10px] leading-relaxed text-text-secondary border-t border-border-muted pt-3 mt-3">
            {block.closing}
          </p>
        )}
      </motion.div>
    );
  }

  // Flat sections (no tabs)
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-3"
    >
      {block.sections && <SectionList sections={block.sections} />}

      {block.closing && (
        <p className="text-[10px] leading-relaxed text-text-secondary border-t border-border-muted pt-3 mt-3">
          {block.closing}
        </p>
      )}
    </motion.div>
  );
}
