import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Heart } from "lucide-react";
import Github from "../icons/Github";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function GithubInfoModal({ isOpen, onClose }: Props) {
    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090b]/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0e1418] p-8 shadow-[0_0_50px_rgba(56,189,248,0.15)] flex flex-col items-center text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative Top Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-primary/10 to-transparent blur-2xl pointer-events-none rounded-full" />

                        {/* Top Right Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-4.5 h-4.5" />
                        </button>

                        {/* GitHub & Project Icon */}
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 shadow-xl mb-5 group">
                            <Github className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
                            <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 border border-slate-950 text-[#0b0f12] shadow-sm">
                                <Heart className="w-3.5 h-3.5 fill-current" />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white tracking-wide mb-2 flex items-center gap-2 justify-center">
                            generatorX
                            <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-semibold">
                                Open Source
                            </span>
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-300 leading-relaxed mb-6">
                            generatorX is a visual schema builder and relational mock data generator. 
                            Design database schemas, configure multi-table relationships, and instantly 
                            generate high-quality relational datasets for development and testing.
                        </p>

                        {/* Open Source Call to Action Box */}
                        <div className="w-full bg-slate-900/40 border border-border rounded-xl p-4 mb-6 text-left space-y-1.5">
                            <h4 className="text-xs font-semibold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                                Contribute & Feedback
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                We welcome any form of contribution! Found a bug? Have a feature idea? 
                                Feel free to open issues, submit pull requests, or share discussions on our GitHub repo.
                            </p>
                        </div>

                        {/* Action Link Button */}
                        <a
                            href="https://github.com/Dharmaprakash-G/Data-generator"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer mb-3"
                        >
                            <Github className="w-5 h-5" />
                            View on GitHub
                            <ExternalLink className="w-4 h-4 opacity-70" />
                        </a>

                        {/* Footnote */}
                        <p className="text-[11px] text-slate-500">
                            ⭐ Star the repository on GitHub if you like the tool!
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default GithubInfoModal;
