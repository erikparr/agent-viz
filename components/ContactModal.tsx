"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  var [copied, setCopied] = useState(false);

  var handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  var handleCopy = useCallback(() => {
    navigator.clipboard.writeText("erik@erikparr.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <TerminalChrome title="Contact">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="text-xs text-text-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none"
                  >
                    [close]
                  </button>
                </div>

                <div className="text-center py-6">
                  <button
                    onClick={handleCopy}
                    className="text-lg font-mono text-border-accent hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none transition-colors"
                  >
                    erik@erikparr.com
                  </button>
                  <p className="text-xs text-text-secondary mt-3 h-4">
                    {copied ? "copied to clipboard" : "click to copy"}
                  </p>
                </div>
              </div>
            </TerminalChrome>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
