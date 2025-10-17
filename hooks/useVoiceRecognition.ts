import { useState, useEffect, useRef, useCallback } from 'react';
import type { RecordingState } from '../types';

// FIX: Add type definitions for Web Speech API to resolve 'Cannot find name SpeechRecognition' errors.
interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}
interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
}
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start(): void;
    stop(): void;
}
declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

// Augment the global Window interface for the SpeechRecognition API
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

export const useVoiceRecognition = () => {
    const [transcript, setTranscript] = useState('');
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            setRecordingState('unavailable');
            return;
        }

        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(prev => prev + finalTranscript);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            
            // Gracefully handle non-critical errors. The 'onend' event will reset the state.
            if (event.error === 'aborted' || event.error === 'no-speech') {
                return;
            }
            
            if(event.error === 'not-allowed') {
                 setRecordingState('denied');
            } else {
                 setRecordingState('error');
            }
        };

        recognition.onend = () => {
             if(recordingState === 'recording') {
                setRecordingState('idle');
            }
        };
        
        return () => {
            recognition.stop();
        };
    }, [recordingState]);

    const start = useCallback(() => {
        if (recognitionRef.current) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(() => {
                    setTranscript('');
                    recognitionRef.current?.start();
                    setRecordingState('recording');
                })
                .catch(err => {
                    console.error('Microphone access denied', err);
                    setRecordingState('denied');
                });
        }
    }, []);

    const stop = useCallback(() => {
        if (recognitionRef.current && recordingState === 'recording') {
            recognitionRef.current.stop();
            setRecordingState('idle');
        }
    }, [recordingState]);

    return { start, stop, transcript, recordingState };
};