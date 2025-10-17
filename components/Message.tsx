import React, { useState } from 'react';
import type { ChatMessage, GeminiResponse, UserMessageContent } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { WarningIcon } from './icons/WarningIcon';
import { FullReportModal } from './FullReportModal';
import { DownloadButtons } from './DownloadButtons';

interface MessageProps {
    message: ChatMessage;
    isFastMode: boolean;
}

const isGeminiResponse = (content: GeminiResponse | UserMessageContent): content is GeminiResponse => {
    return 'source' in content;
};

export const Message: React.FC<MessageProps> = ({ message, isFastMode }) => {
    const [showFull, setShowFull] = useState(!isFastMode);

    React.useEffect(() => {
        setShowFull(!isFastMode);
    }, [isFastMode]);
    
    if (message.sender === 'user') {
        const content = message.content as UserMessageContent;
        return (
            <div className="flex justify-end items-start space-x-4">
                <div className="bg-blue-600 p-4 rounded-lg max-w-2xl">
                    <p>{content.summary}</p>
                </div>
                <div className="flex-shrink-0">
                    <UserIcon />
                </div>
            </div>
        );
    }

    // Bot message
    if (!isGeminiResponse(message.content)) return null;
    const content = message.content;

    const getSeverityClass = (severity?: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-400 border-red-400';
            case 'High': return 'text-orange-400 border-orange-400';
            case 'Medium': return 'text-yellow-400 border-yellow-400';
            case 'Low': return 'text-green-400 border-green-400';
            default: return 'text-gray-400 border-gray-400';
        }
    }
    
    const FastSummaryView = () => (
         <div className="space-y-4">
            {content.diagnostic_steps && content.diagnostic_steps.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Top Diagnostic Step</h3>
                    <p className="text-gray-300 pl-4">{content.diagnostic_steps[0]}</p>
                </div>
            )}
            {content.corrective_actions && content.corrective_actions.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Top Corrective Action</h3>
                    <p className="text-gray-300 pl-4">{content.corrective_actions[0]}</p>
                </div>
            )}
             <button onClick={() => setShowFull(true)} className="text-cyan-400 hover:underline text-sm">
                Show full report...
            </button>
         </div>
    );
    
    const FullResponseView = () => (
         <div className="space-y-4">
            {content.diagnostic_steps && content.diagnostic_steps.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Diagnostic Steps</h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300">
                        {content.diagnostic_steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                </div>
            )}

            {content.corrective_actions && content.corrective_actions.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 text-gray-200">Corrective Actions</h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300">
                        {content.corrective_actions.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                </div>
            )}

             {content.assumptions && content.assumptions.length > 0 && (
                <div className="p-3 bg-gray-800/50 rounded-md">
                    <h3 className="font-semibold mb-1 text-gray-400 text-sm">Assumptions</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                        {content.assumptions.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </div>
            )}

            {content.safety_disclaimer && (
                 <div className="mt-4 p-3 bg-yellow-900/40 border border-yellow-700 rounded-lg flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1"><WarningIcon /></div>
                    <div>
                        <h4 className="font-bold text-yellow-300">Safety First</h4>
                        <p className="text-yellow-200">{content.safety_disclaimer}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex justify-start items-start space-x-4">
            <div className="flex-shrink-0">
                <BotIcon />
            </div>
            <div className="bg-gray-700 p-4 rounded-lg max-w-3xl w-full" id={`message-content-${message.id}`}>
                <div className="flex justify-between items-center mb-3 border-b border-gray-600 pb-2">
                    <span className="font-bold text-lg text-cyan-400">{content.summary}</span>
                     {content.source === 'dataset' && content.fullReportData && (
                        <span className={`text-sm font-semibold px-2 py-1 border rounded ${getSeverityClass(content.fullReportData.severity)}`}>
                           Severity: {content.fullReportData.severity}
                        </span>
                    )}
                </div>

                {content.source === 'system-error' ? (
                     <p className="text-red-300">{content.summary}</p>
                ) : content.source === 'system' ? (
                     <p>{content.summary}</p>
                ) : (
                    <>
                       {showFull ? <FullResponseView /> : <FastSummaryView />}

                        <div className="mt-4 pt-3 border-t border-gray-600 flex items-center justify-end text-xs text-gray-400">
                           <div className="flex items-center space-x-2">
                               <DownloadButtons response={content} elementId={`message-content-${message.id}`} />
                           </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};