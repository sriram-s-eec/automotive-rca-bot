import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { Message } from './Message';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ChatWindowProps {
    messages: ChatMessage[];
    isLoading: boolean;
    isFastMode: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, isFastMode }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} isFastMode={isFastMode} />
            ))}
            {isLoading && (
                <div className="flex justify-start items-center space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-cyan-800 flex items-center justify-center">
                             <svg className="w-6 h-6 text-cyan-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg max-w-2xl">
                        <div className="flex items-center space-x-2">
                           <SpinnerIcon />
                            <span>Analyzing...</span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};