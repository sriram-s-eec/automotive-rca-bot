export interface RcaEntry {
    id: number;
    title: string;
    machine_type: string;
    symptoms: string[];
    probable_root_causes: string[];
    recommended_actions: string[];
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    likely_frequency: 'Rare' | 'Occasional' | 'Frequent';
    keywords: string;
    example_user_phrases: string[];
    notes?: string;
}

export interface GeminiResponse {
    source: 'dataset' | 'gemini' | 'system' | 'system-error' | 'semantic-match';
    confidence?: number;
    matchedId?: number | number[];
    similarityScores?: number[];
    summary: string;
    diagnostic_steps?: string[];
    corrective_actions?: string[];
    assumptions?: string[];
    safety_disclaimer?: string;
    fullReportData?: RcaEntry;
}

export interface UserMessageContent {
    summary: string;
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'bot';
    content: GeminiResponse | UserMessageContent;
}

export type RecordingState = 'idle' | 'recording' | 'denied' | 'error' | 'unavailable';