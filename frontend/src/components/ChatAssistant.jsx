import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatAssistant } from '@/context/ChatContext';

const ChatAssistant = () => {
    const { isChatOpen, closeChat, toggleChat } = useChatAssistant();
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: 'Hello! 👋 I\'m your AdventureNexus AI assistant. How can I help you plan your perfect trip today?',
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const scrollRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Drag handlers
    const handleMouseDown = (e) => {
        if (isChatOpen) return; // Don't allow dragging when chat is open
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Keep button within viewport bounds
        const maxX = window.innerWidth - 64;
        const maxY = window.innerHeight - 64;

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, dragOffset]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: inputMessage,
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const aiMessage = {
                id: messages.length + 2,
                type: 'ai',
                text: getAIResponse(inputMessage),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const getAIResponse = (userInput) => {
        const input = userInput.toLowerCase();

        if (input.includes('hello') || input.includes('hi')) {
            return 'Hello! How can I assist you with your travel plans today?';
        } else if (input.includes('destination') || input.includes('where')) {
            return 'I can help you find amazing destinations! Try using our AI-powered search to discover personalized travel plans based on your preferences.';
        } else if (input.includes('budget')) {
            return 'We offer travel plans for all budgets - from budget-friendly adventures to luxury experiences. What\'s your preferred budget range?';
        } else if (input.includes('help')) {
            return 'I can help you with:\n• Finding destinations\n• Planning itineraries\n• Budget recommendations\n• Travel tips\n• Booking assistance\n\nWhat would you like to know?';
        } else {
            return 'That\'s a great question! Our AI-powered platform can help you with personalized travel recommendations. Feel free to explore our search feature or ask me anything about planning your trip!';
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                ref={buttonRef}
                onClick={() => !isDragging && toggleChat()}
                onMouseDown={handleMouseDown}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
                className={`fixed z-50 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center group ${isChatOpen ? 'scale-0' : 'scale-100 hover:scale-110'
                    } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                aria-label="Open chat assistant"
            >
                <Bot className="w-8 h-8 text-white animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </button>

            {/* Chat Modal */}
            {isChatOpen && (
                <div
                    style={{
                        left: position.x > window.innerWidth / 2 ? 'auto' : `${position.x}px`,
                        right: position.x > window.innerWidth / 2 ? `${window.innerWidth - position.x - 64}px` : 'auto',
                        bottom: position.y > window.innerHeight / 2 ? `${window.innerHeight - position.y}px` : 'auto',
                        top: position.y > window.innerHeight / 2 ? 'auto' : `${position.y + 80}px`,
                    }}
                    className="fixed z-50 w-96 h-[600px] max-h-[80vh] bg-card border-2 border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold font-outfit">AI Travel Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-white/80 text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closeChat}
                            className="text-white hover:bg-white/20 rounded-full"
                        >
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 bg-background/50 overflow-y-auto" ref={scrollRef}>
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 duration-300`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === 'user'
                                            ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                                            : 'bg-muted text-foreground rounded-bl-none border border-border'
                                            }`}
                                    >
                                        {message.type === 'ai' && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <Sparkles size={14} className="text-primary" />
                                                <span className="text-xs font-semibold text-primary">AI Assistant</span>
                                            </div>
                                        )}
                                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                                        <span className="text-xs opacity-60 mt-1 block">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start animate-in fade-in-50 duration-300">
                                    <div className="bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-3 border border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-xs text-muted-foreground">AI is typing...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Input */}
                    <div className="p-4 border-t border-border bg-card">
                        <div className="flex gap-2">
                            <Input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 rounded-xl bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-4"
                            >
                                <Send size={18} />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Powered by AI • AdventureNexus
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatAssistant;
