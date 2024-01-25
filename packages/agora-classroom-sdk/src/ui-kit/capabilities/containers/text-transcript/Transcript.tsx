import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';
import annyang from 'annyang';

interface TranscriptProps {
  stream: EduStreamUI;
}

const Transcript: React.FC<TranscriptProps> = observer(({ stream }) => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(stream.stream.fromUser.userName);

  useEffect(() => {
    // Initialize annyang
    if (annyang) {
      annyang.addCallback('result', (phrases: string[]) => {
        const newTranscription = phrases[0];
        const currentUser = stream.stream.fromUser.userName;
        setTranscription(newTranscription);
        transcriptionStore.addTranscription(newTranscription, currentUser);
      });

      // Start listening
      annyang.start();
    } else {
      console.error('Annyang not available in this browser');
    }

    // Cleanup: Stop listening when the component unmounts
    return () => {
      if (annyang) {
        annyang.abort();
      }
    };
  }, [stream.stream.fromUser.userName]);

  useEffect(() => {
    setUsername(stream.stream.fromUser.userName);
  }, [stream.stream.fromUser.userName]);

  return (
    <div
      className="flex justify-center items-center w-screen fixed left-0 bottom-0"
      style={{
        marginBottom:
          stream.stream.fromUser.role === 'host'
            ? '40px'
            : stream.stream.fromUser.role === 'broadcaster'
            ? '15px'
            : '0',
      }}
    >
      {transcription && (
        <div className="mb-2">
          <span className="font-bold">{username}:</span>
          <span className="ml-2">{transcription}</span>
        </div>
      )}
    </div>
  );
});

export default Transcript;
