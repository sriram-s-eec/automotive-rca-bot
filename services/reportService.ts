import type { GeminiResponse } from '../types';

declare global {
    interface Window {
        jspdf: any;
    }
}

const generateFileName = (summary: string, extension: string) => {
    const sanitized = summary.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `RCA_Report_${sanitized.substring(0, 20)}_${timestamp}.${extension}`;
}

export const downloadPdf = async (response: GeminiResponse) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor('#0e7490');
    doc.text('Root Cause Analysis Report', 14, 22);

    doc.setFontSize(12);
    doc.setTextColor('#ffffff');
    doc.text(`Title: ${response.summary}`, 14, 32);

    doc.setLineWidth(0.5);
    doc.setDrawColor('#374151');
    doc.line(14, 35, 196, 35);
    
    let yPos = 45;
    
    const addSection = (title: string, content: string[] | undefined) => {
        if (!content || content.length === 0) return;
        doc.setFontSize(14);
        doc.setTextColor('#67e8f9');
        doc.text(title, 14, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setTextColor('#d1d5db');
        content.forEach(item => {
            const splitText = doc.splitTextToSize(`- ${item}`, 180);
            doc.text(splitText, 18, yPos);
            yPos += (splitText.length * 5);
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
        });
        yPos += 5;
    };
    
    addSection('Diagnostic Steps', response.diagnostic_steps);
    addSection('Corrective Actions', response.corrective_actions);
    addSection('Assumptions', response.assumptions);

    if (response.safety_disclaimer) {
        doc.setFillColor('#451a03');
        doc.rect(14, yPos, 182, 15, 'F');
        doc.setFontSize(11);
        doc.setTextColor('#fde047');
        doc.text("Safety First", 16, yPos + 6);
        doc.setFontSize(9);
        doc.setTextColor('#fed7aa');
        const disclaimerText = doc.splitTextToSize(response.safety_disclaimer, 178);
        doc.text(disclaimerText, 16, yPos + 11);
        yPos += 20;
    }
    
    doc.save(generateFileName(response.summary, 'pdf'));
};


export const downloadCsv = (response: GeminiResponse) => {
    const headers = ['Category', 'Details'];
    const rows = [
        ['Title', response.summary],
        ['Source', response.source],
    ];

    if (response.confidence) {
        rows.push(['Confidence', `${(response.confidence * 100).toFixed(0)}%`]);
    }
    if(response.fullReportData?.severity) {
         rows.push(['Severity', response.fullReportData.severity]);
    }

    response.diagnostic_steps?.forEach((step, i) => {
        rows.push([`Diagnostic Step ${i+1}`, step]);
    });
    
    response.corrective_actions?.forEach((step, i) => {
        rows.push([`Corrective Action ${i+1}`, step]);
    });
    
     response.assumptions?.forEach((step, i) => {
        rows.push([`Assumption ${i+1}`, step]);
    });

    if (response.safety_disclaimer) {
        rows.push(['Safety Disclaimer', response.safety_disclaimer]);
    }
    
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => `"${e[0].replace(/"/g, '""')}"` + "," + `"${e[1].replace(/"/g, '""')}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", generateFileName(response.summary, 'csv'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};