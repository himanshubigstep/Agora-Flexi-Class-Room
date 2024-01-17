import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';

const Transcript = observer(({ stream }: { stream: EduStreamUI }) => {
  const [currentTranscription, setCurrentTranscription] = useState('');
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  useEffect(() => {
    if (!recognition) {
      console.error('Speech recognition not supported on this browser');
      return;
    }

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const newTranscription = event.results[last][0].transcript;
      const userName = stream.stream.fromUser.userName;
      transcriptionStore.addTranscription(newTranscription, userName);
      setCurrentTranscription(newTranscription);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      recognition.start();
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-screen fixed left-0 bottom-0"
      style=
        {
          {
            marginBottom: stream.stream.fromUser.role === 'host' ? '40px' : stream.stream.fromUser.role === 'broadcaster' ? '15px' : '0'
          }
        }
    >
      {/* <p className="mb-2">
        <span className="font-bold mr-2">{stream.stream.fromUser.userName}:</span>
        <span className="font-bold">{currentTranscription}</span>
      </p> */}
    </div>
  );
});

export default Transcript;
