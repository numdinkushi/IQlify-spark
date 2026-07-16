"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl border-t border-accent/25 bg-card shadow-2xl"
          >
            <div className="flex shrink-0 justify-center pb-2 pt-3">
              <div className="h-1 w-12 rounded-full bg-muted-foreground/30" />
            </div>
            {title ? (
              <div className="flex shrink-0 items-center justify-between border-b border-accent/10 px-6 py-4">
                <h2 className="text-lg font-semibold iqlify-accent-text">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-accent/15"
                >
                  <X className="size-5 text-foreground" />
                </button>
              </div>
            ) : null}
            <div className="flex-1 overflow-y-auto overscroll-contain p-6 pb-8">
              {children}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
