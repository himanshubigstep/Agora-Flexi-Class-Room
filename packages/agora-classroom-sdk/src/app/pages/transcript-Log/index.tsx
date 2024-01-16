import React from 'react'
import transcriptionStore from '@/infra/stores/common/TranscriptStore'
import { useHistory } from 'react-router-dom';
import jsPDF from 'jspdf';

const TranscriptLog = () => {
    const transcripts = transcriptionStore.transcriptions
    const userNames = transcriptionStore.userNames
    const history = useHistory();

    const downloadPdf = () => {
        const pdf = new jsPDF();

        // Set title for the PDF
        pdf.setFontSize(20);
        pdf.text('Transcript Log', 20, 20);

        // Set font style for content
        pdf.setFont('helvetica');
        pdf.setFontSize(12);

        // Add content to the PDF
        transcripts.forEach((transcript, index) => {
            const yPos = 30 + index * 15; // Adjust the vertical spacing
            pdf.text(`${userNames[index]}: ${transcript}`, 20, yPos);
        });

        // Save the PDF with a specific name
        pdf.save('transcript-log.pdf');
    };

    const goToHomePage = () => {
        // Assuming you have a route named "home"
        history.push('/');
    };


    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20
        }}>
            <h2 className="text-4xl font-bold text-indigo-700">
                Transcript log
            </h2>
            <ul className="list-none space-y-2">
                {transcripts.map((transcript, index) => (
                    <li key={index} className="mb-2 flex items-start">
                        <span className="text-teal-500 font-bold mr-2">{userNames[index]}:</span>
                        <span className="text-gray-800">{transcript}</span>
                    </li>
                ))}
            </ul>
            <button onClick={downloadPdf} className="bg-blue-500 text-white py-2 px-4 rounded">
                Download PDF
            </button>
            <button onClick={goToHomePage} className="bg-gray-500 text-white py-2 px-4 rounded">
                Close and Go to Homepage
            </button>
        </div>
    )
}
export default TranscriptLog