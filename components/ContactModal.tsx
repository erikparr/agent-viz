"use client";

import { useCallback, useState } from "react";
import { Modal } from "./ui/Modal";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  var [copied, setCopied] = useState(false);

  var handleCopy = useCallback(() => {
    navigator.clipboard.writeText("erik@erikparr.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <Modal open={open} onClose={onClose} title="Contact" size="sm">
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
    </Modal>
  );
}
