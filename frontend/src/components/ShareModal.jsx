import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Facebook, Twitter, MessageCircle, Check, X, Share2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ShareModal = ({ isOpen, onClose, planId, planName }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = `${window.location.origin}/shared-plan/${planId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const socialPlatforms = [
        {
            name: "X",
            icon: <Twitter className="w-5 h-5" />,
            url: `https://twitter.com/intent/tweet?text=Check out my travel plan for ${planName} on AdventureNexus!&url=${encodeURIComponent(shareUrl)}`,
            color: "group-hover:bg-[#1DA1F2] group-hover:text-white",
            bg: "bg-[#1DA1F2]/10",
            textColor: "text-[#1DA1F2]"
        },
        {
            name: "Facebook",
            icon: <Facebook className="w-5 h-5" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: "group-hover:bg-[#1877F2] group-hover:text-white",
            bg: "bg-[#1877F2]/10",
            textColor: "text-[#1877F2]"
        },
        {
            name: "WhatsApp",
            icon: <MessageCircle className="w-5 h-5" />,
            url: `https://wa.me/?text=Check out my travel plan for ${planName} on AdventureNexus! ${encodeURIComponent(shareUrl)}`,
            color: "group-hover:bg-[#25D366] group-hover:text-white",
            bg: "bg-[#25D366]/10",
            textColor: "text-[#25D366]"
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card/80 border-border shadow-2xl backdrop-blur-2xl p-0 overflow-hidden border-2">
                <div className="p-6 space-y-6 relative">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <Share2 size={24} />
                            </div>
                            <DialogTitle className="text-2xl font-bold font-outfit text-foreground">
                                Share Itinerary
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            Spread the adventure! Anyone with this private link can view the curated plan for <span className="font-bold text-foreground">"{planName}"</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col space-y-6">
                        <div className="relative group">
                            <label htmlFor="link" className="sr-only">Link</label>
                            <div className="flex items-center gap-2 p-1 bg-muted/40 rounded-2xl border-2 border-border focus-within:border-primary/50 transition-all">
                                <Input
                                    id="link"
                                    readOnly
                                    value={shareUrl}
                                    className="border-0 bg-transparent text-foreground h-10 focus-visible:ring-0 px-4 font-mono text-xs"
                                />
                                <Button
                                    type="button"
                                    onClick={handleCopy}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 h-10 min-w-[100px] transition-all relative overflow-hidden active:scale-95"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                key="check"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="flex items-center gap-2 font-bold"
                                            >
                                                <Check className="h-4 w-4" />
                                                Saved!
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="flex items-center gap-2 font-bold"
                                            >
                                                <Copy className="h-4 w-4" />
                                                Copy
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] flex-1 bg-border"></div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Share via Socials</span>
                                <div className="h-[1px] flex-1 bg-border"></div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                {socialPlatforms.map((platform, idx) => (
                                    <motion.a
                                        key={platform.name}
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-border bg-background/50 transition-all duration-300 group hover:border-transparent ${platform.color} hover:shadow-lg active:scale-95`}
                                    >
                                        <div className={`p-3 rounded-full ${platform.bg} ${platform.textColor} group-hover:bg-white group-hover:text-current transition-colors duration-300 shadow-sm`}>
                                            {platform.icon}
                                        </div>
                                        <span className="text-xs font-bold font-outfit uppercase tracking-wider">{platform.name}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-purple-600"></div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;
