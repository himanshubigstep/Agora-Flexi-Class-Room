import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';

interface TranscriptProps {
  stream: EduStreamUI;
}

const Transcript: React.FC<TranscriptProps> = observer(({ stream }) => {
  const [transcriptions, setTranscriptions] = useState<{ [username: string]: string }>({});

  useEffect(() => {
    let recognition;

    const initRecognition = () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.onresult = (event) => {
          let newTranscription = '';
          for (let i = 0; i < event.results.length; i++) {
            newTranscription += event.results[i][0].transcript + ' ';
          }

          setTranscriptions((prevTranscriptions) => ({
            ...prevTranscriptions,
            [stream.stream.fromUser.userName]: newTranscription.trim(),
          }));

          // You may choose to keep this line or remove it based on your requirements
          transcriptionStore.addTranscription(newTranscription.trim(), stream.stream.fromUser.userName);
        };

        recognition.onerror = (error) => {
          console.error('SpeechRecognition error:', error);
        };

        recognition.onend = () => {
          // Restart recognition after it ends
          recognition.start();
        };

        recognition.start();
      } else {
        console.error('Speech recognition not supported in this browser');
      }
    };

    initRecognition();

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
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
      {transcriptions[stream.stream.fromUser.userName] && (
        <div className="mb-2">
          <span className="font-bold">{stream.stream.fromUser.userName}:</span>
          <span className="ml-2">{transcriptions[stream.stream.fromUser.userName]}</span>
        </div>
      )}
    </div>
  );
});

export default Transcript;
