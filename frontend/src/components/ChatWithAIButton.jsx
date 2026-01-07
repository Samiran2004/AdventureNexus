import { MessageCircle, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatAssistant } from '@/context/ChatContext';

const ChatWithAIButton = ({ variant = "default", size = "default", className = "" }) => {
    const { openChat } = useChatAssistant();

    return (
        <Button
            onClick={openChat}
            variant={variant}
            size={size}
            className={`relative group overflow-hidden bg-gradient-to-r from-primary via-secondary to-purple-600 hover:from-primary/90 hover:via-secondary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${className}`}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Content */}
            <div className="relative flex items-center gap-2">
                {/* Animated Bot Icon with Notion-style gradient */}
                <div className="relative">
                    {/* Gradient overlay animation */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 animate-spin-slow blur-sm"></div>

                    {/* Icon container with animated gradient */}
                    <div className="relative w-5 h-5 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full animate-gradient-rotate opacity-80"></div>
                        <Bot size={18} className="relative z-10 text-white drop-shadow-lg" />
                    </div>

                    {/* Sparkles */}
                    <Sparkles size={10} className="absolute -top-1 -right-1 text-yellow-300 animate-ping" />
                </div>

                <span className="font-outfit">Chat with AI Assistant</span>
                <MessageCircle size={16} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl bg-gradient-to-r from-primary/50 via-secondary/50 to-purple-600/50 -z-10 transition-opacity duration-300"></div>
        </Button>
    );
};

export default ChatWithAIButton;
