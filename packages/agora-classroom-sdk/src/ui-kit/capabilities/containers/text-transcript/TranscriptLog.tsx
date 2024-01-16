import React from 'react';

interface TranscriptLogProps {
  transcripts: string[];
  userNames: string[];
}

const TranscriptLog: React.FC<TranscriptLogProps> = ({ transcripts, userNames }) => {
  console.log(transcripts, userNames, 'details'); // Log the received props if needed

  return (
    <div className="mt-4" style={{
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: '#f1f1f1'
    }}>
      <h2 className="text-xl font-bold mb-2">Transcript Log</h2>
      <ul className="list-disc pl-4">
        {transcripts.map((transcript, index) => (
          <li key={index} className="mb-2">
            <strong className="mr-2">{userNames[index]}:</strong> {transcript}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TranscriptLog;
