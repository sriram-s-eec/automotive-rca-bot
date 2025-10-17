
import React from 'react';
import type { RcaEntry } from '../types';

interface FullReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: RcaEntry;
}

export const FullReportModal: React.FC<FullReportModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-cyan-400">{data.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                <div className="space-y-6 text-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <InfoCard label="Machine Type" value={data.machine_type} />
                        <InfoCard label="Severity" value={data.severity} />
                        <InfoCard label="Likely Frequency" value={data.likely_frequency} />
                    </div>

                    <Section title="Symptoms">
                        <ul className="list-disc list-inside space-y-1">
                            {data.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </Section>

                    <Section title="Probable Root Causes (Ranked)">
                         <ol className="list-decimal list-inside space-y-1">
                            {data.probable_root_causes.map((c, i) => <li key={i}>{c}</li>)}
                        </ol>
                    </Section>

                     <Section title="Recommended Actions">
                         <ol className="list-decimal list-inside space-y-2">
                            {data.recommended_actions.map((a, i) => <li key={i}>{a}</li>)}
                        </ol>
                    </Section>
                    
                    {data.notes && (
                        <Section title="Notes">
                           <p className="italic">{data.notes}</p>
                        </Section>
                    )}

                </div>
                <div className="mt-8 text-right">
                    <button onClick={onClose} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

interface InfoCardProps {
    label: string;
    value: string;
}
const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => (
    <div className="bg-gray-700/50 p-3 rounded-md">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold">{value}</p>
    </div>
);

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
     <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-2 border-b border-gray-600 pb-1">{title}</h3>
        {children}
    </div>
);
