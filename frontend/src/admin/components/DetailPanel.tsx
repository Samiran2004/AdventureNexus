import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ isOpen, onClose, title, description, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-[#0A0A0A] border-l border-white/5 z-50 shadow-2xl flex flex-col"
                    >
                        {/* Visual Accent */}
                        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent"></div>

                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gray-900/20 backdrop-blur-xl">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
                                {description && <p className="text-gray-500 text-sm font-medium">{description}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                            >
                                <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent_40%)]">
                            <div className="p-8">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DetailPanel;
