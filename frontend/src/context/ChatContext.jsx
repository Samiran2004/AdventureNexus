import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const openChat = () => setIsChatOpen(true);
    const closeChat = () => setIsChatOpen(false);
    const toggleChat = () => setIsChatOpen(!isChatOpen);

    return (
        <ChatContext.Provider value={{ isChatOpen, openChat, closeChat, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatAssistant = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatAssistant must be used within ChatProvider');
    }
    return context;
};
