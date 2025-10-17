import React from 'react';

interface SpeedToggleProps {
    isFast: boolean;
    onToggle: (isFast: boolean) => void;
}

export const SpeedToggle: React.FC<SpeedToggleProps> = ({ isFast, onToggle }) => {
    return (
        <div className="flex items-center space-x-2 p-1 bg-gray-700 rounded-lg">
            <button
                onClick={() => onToggle(true)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${isFast ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
                Fast Summary
            </button>
            <button
                onClick={() => onToggle(false)}
                 className={`px-3 py-1 text-sm rounded-md transition-colors ${!isFast ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            >
                Full Report
            </button>
        </div>
    );
};