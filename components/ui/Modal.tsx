"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalChrome } from "./TerminalChrome";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  scrollable?: boolean;
  children: ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const SCROLL_CLASSES =
  "max-h-[90vh] overflow-y-auto scrollbar-terminal " +
  "[&::-webkit-scrollbar]:w-1.5 " +
  "[&::-webkit-scrollbar-track]:bg-transparent " +
  "[&::-webkit-scrollbar-thumb]:bg-gray-500 " +
  "[&::-webkit-scrollbar-thumb]:rounded-none";

export function Modal({
  open,
  onClose,
  title,
  size = "sm",
  scrollable = false,
  children,
}: ModalProps) {
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
            className={`relative w-full ${SIZE_CLASSES[size]} ${
              scrollable ? SCROLL_CLASSES : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <TerminalChrome title={title}>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    [close]
                  </Button>
                </div>
                {children}
              </div>
            </TerminalChrome>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
