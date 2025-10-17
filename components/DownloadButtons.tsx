import React from 'react';
import type { GeminiResponse } from '../types';
import { downloadPdf, downloadCsv } from '../services/reportService';
import { DownloadIcon } from './icons/DownloadIcon';

interface DownloadButtonsProps {
    response: GeminiResponse;
    elementId: string;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({ response, elementId }) => {
    const handleDownloadPdf = () => {
        downloadPdf(response);
    };

    const handleDownloadCsv = () => {
        downloadCsv(response);
    };
    
    if (response.source === 'system' || response.source === 'system-error') {
        return null;
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleDownloadPdf}
                className="flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs"
                title="Download as PDF"
            >
                <DownloadIcon /> PDF
            </button>
            <button
                onClick={handleDownloadCsv}
                className="flex items-center px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-xs"
                title="Download as CSV"
            >
               <DownloadIcon /> CSV
            </button>
        </div>
    );
};