import React, { useState, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState('');
    const { start, stop, transcript, recordingState } = useVoiceRecognition();

    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleVoiceSubmit = () => {
        stop();
        if (transcript.trim() && !disabled) {
            onSendMessage(transcript.trim());
            setInput('');
        }
    }

    const getMicButton = () => {
        switch (recordingState) {
            case 'recording':
                return (
                    <button type="button" onClick={handleVoiceSubmit} className="bg-red-600 text-white rounded-full p-3 hover:bg-red-500 transition-colors" aria-label="Stop recording">
                        <StopIcon />
                    </button>
                );
            case 'denied':
            case 'unavailable':
            case 'error':
                 return (
                    <button type="button" disabled className="bg-gray-600 text-white rounded-full p-3 cursor-not-allowed" aria-label="Microphone unavailable">
                        <MicrophoneIcon />
                    </button>
                );
            case 'idle':
            default:
                return (
                     <button type="button" onClick={start} disabled={disabled} className="bg-cyan-600 text-white rounded-full p-3 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors" aria-label="Start recording">
                        <MicrophoneIcon />
                    </button>
                );
        }
    }

    const getPlaceholderText = () => {
        switch (recordingState) {
            case 'recording':
                return 'Listening... Speak now. Press stop when done.';
            case 'denied':
                return 'Microphone access was denied. Please enable it in your browser settings.';
            case 'unavailable':
                return 'Speech recognition is not available in your browser.';
            case 'error':
                return 'An error occurred with voice recognition. Please try again.';
            default:
                return "Describe the issue, e.g., 'The welding robot wire is jamming.'";
        }
    }

    return (
        <div className="p-4 bg-gray-900 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={getPlaceholderText()}
                    disabled={disabled || recordingState === 'recording'}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-800"
                />
                {getMicButton()}
                <button
                    type="submit"
                    disabled={disabled || !input.trim() || recordingState === 'recording'}
                    className="bg-cyan-600 text-white rounded-full p-3 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};