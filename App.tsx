import React, { useState, useCallback, useEffect } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { SpeedToggle } from './components/SpeedToggle';
import type { ChatMessage, RcaEntry, GeminiResponse } from './types';
import { rcaDataset } from './data/rcaData';
import { generateRcaResponse } from './services/geminiService';

const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFastMode, setIsFastMode] = useState(true);

    const initialMessage: ChatMessage = {
        id: Date.now(),
        sender: 'bot',
        content: {
            source: 'system',
            summary: "Welcome to the Automotive RCA Chatbot. Describe the issue you're facing with your equipment by typing or using the microphone.",
        }
    };

    useEffect(() => {
        setMessages([initialMessage]);
    }, []);

    const findExactMatch = (query: string): RcaEntry | null => {
        const normalizedQuery = query.trim().toLowerCase();
        for (const entry of rcaDataset) {
            for (const phrase of entry.example_user_phrases) {
                if (phrase.toLowerCase() === normalizedQuery) {
                    return entry;
                }
            }
        }
        return null;
    };

    const handleSendMessage = useCallback(async (query: string) => {
        if (!query) return;
        setError(null);
        const userMessage: ChatMessage = { id: Date.now(), sender: 'user', content: { summary: query } };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const exactMatch = findExactMatch(query);

            let botResponseContent: GeminiResponse;

            if (exactMatch) {
                botResponseContent = {
                    source: 'dataset',
                    confidence: 1.0,
                    matchedId: exactMatch.id,
                    summary: exactMatch.title,
                    diagnostic_steps: exactMatch.recommended_actions.filter(a => a.toLowerCase().includes('check') || a.toLowerCase().includes('inspect') || a.toLowerCase().includes('test')),
                    corrective_actions: exactMatch.recommended_actions.filter(a => !a.toLowerCase().includes('check') && !a.toLowerCase().includes('inspect') && !a.toLowerCase().includes('test')),
                    assumptions: ["The user query is an exact match to a known issue."],
                    safety_disclaimer: "Confirm lockout/tagout and use qualified personnel before attempting electrical or mechanical repairs.",
                    fullReportData: exactMatch
                };
            } else {
                 botResponseContent = await generateRcaResponse(query, rcaDataset);
            }
            
            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                content: botResponseContent
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to get response from Gemini API. ${errorMessage}`);
            const errorBotMessage: ChatMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                content: {
                    source: 'system-error',
                    summary: `Sorry, I encountered an error. Please check your API key and network connection. Details: ${errorMessage}`
                }
            };
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-800/50">
            <header className="bg-gray-900 shadow-md p-4 flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                     <svg className="w-8 h-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                    </svg>
                    <h1 className="text-xl font-bold text-white">Automotive RCA Chatbot</h1>
                </div>
                <SpeedToggle isFast={isFastMode} onToggle={setIsFastMode} />
            </header>
            <ChatWindow messages={messages} isLoading={isLoading} isFastMode={isFastMode} />
            {error && <div className="p-4 text-red-400 bg-red-900/50 text-center">{error}</div>}
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
    );
};

export default App;