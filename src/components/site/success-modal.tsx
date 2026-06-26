"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/nav";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessModal({ open, onClose }: SuccessModalProps) {
  const handleCheckStatus = () => {
    onClose();
    navigate("my-registration");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Decorative top banner */}
            <div className="h-2 bg-gradient-navy" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 py-8 sm:px-8 text-center">
              {/* Animated success icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  delay: 0.15,
                }}
                className="mx-auto mb-5 flex items-center justify-center w-20 h-20 rounded-full bg-brand-green/10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", damping: 10 }}
                >
                  <CheckCircle2
                    className="w-14 h-14 text-brand-green"
                    strokeWidth={2.2}
                  />
                </motion.div>
              </motion.div>

              <h2
                id="success-modal-title"
                className="text-xl sm:text-2xl font-bold text-navy mb-3"
              >
                Registration Submitted Successfully!
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-7">
                Your registration has been submitted. We are reviewing your bKash
                transaction. Once verified, you will receive an SMS with your ID
                number. You can check your status anytime using your phone number.
              </p>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:flex-1 border-border text-foreground hover:bg-muted"
                >
                  Close
                </Button>
                <Button
                  onClick={handleCheckStatus}
                  className="w-full sm:flex-1 bg-gradient-navy text-white hover:opacity-90 shadow-navy"
                >
                  <Search className="w-4 h-4" />
                  Check My Status
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
