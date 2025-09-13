import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { sendMessageToChatStream } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';
import { useTranslations } from '../hooks/useTranslations';
import { useFeedback } from '../hooks/useFeedback';

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
);

const ChatbotSection: React.FC = () => {
    const { t, language } = useTranslations();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { showFeedbackModal, FeedbackModalComponent } = useFeedback('chatbot');

    // Effect to set initial message based on language
    useEffect(() => {
        setMessages([{ sender: 'ai', text: t('chatbot.initialMessage') }]);
    }, [t]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        let success = false;

        try {
            const stream = await sendMessageToChatStream(currentInput, language);
            
            let currentAiMessage = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

            for await (const chunk of stream) {
                const chunkText = (chunk as GenerateContentResponse).text;
                currentAiMessage += chunkText;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'ai', text: currentAiMessage };
                    return newMessages;
                });
            }
            success = true;
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'ai', text: t('chatbot.errorMessage') }]);
        } finally {
            setIsLoading(false);
            if (success) {
                showFeedbackModal();
            }
        }
    };

    return (
        <section id="chatbot" className="py-20 bg-white">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 text-center lg:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold">{t('chatbot.title')}</h2>
                    <p className="text-lg text-gray-600 mt-4">
                        {t('chatbot.subtitle')}
                    </p>
                </div>
                <div className="lg:w-1/2 w-full max-w-lg">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 h-[70vh] md:h-[600px] flex flex-col">
                        <div className="p-4 border-b text-lg font-semibold text-center">{t('chatbot.header')}</div>
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-50">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-gray-200 text-brand-dark rounded-bl-none'}`}>
                                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={t('chatbot.placeholder')}
                                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading} className="ml-3 p-3 rounded-full bg-brand-green text-white hover:bg-brand-green-light disabled:bg-gray-400 transition-colors">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackModalComponent />
        </section>
    );
};

export default ChatbotSection;