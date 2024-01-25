import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';

interface TranscriptProps {
  stream: EduStreamUI;
}

const Transcript: React.FC<TranscriptProps> = observer(({ stream }) => {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(stream.stream.fromUser.userName);

  const recognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;

  // Use a dictionary to store recognition instances for each user
  const recognitionInstances: { [key: string]: SpeechRecognition } = {};

  useEffect(() => {
    const initRecognition = () => {
      if (recognition) {
        const recognitionInstance = new recognition();
        recognitionInstance.lang = '';
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const newTranscription = event.results[0][0].transcript;
          setTranscription(newTranscription);
          transcriptionStore.addTranscription(newTranscription, username);
        };

        recognitionInstance.onend = () => {
          // Restart recognition after it ends
          recognitionInstance.start();
        };

        // Store the recognition instance for the current user
        recognitionInstances[username] = recognitionInstance;
      } else {
        console.error('SpeechRecognition API not supported in this browser');
      }
    };

    // Initialize recognition for the current user
    initRecognition();

    // Start speech recognition for the current user
    if (recognitionInstances[username]) {
      recognitionInstances[username].start();
    }

    // Cleanup: Stop recognition when the component unmounts
    return () => {
      if (recognitionInstances[username]) {
        recognitionInstances[username].stop();
      }
    };
  }, [username]);

  useEffect(() => {
    // Update username when stream prop changes
    setUsername(stream.stream.fromUser.userName);
  }, [stream.stream.fromUser.userName]);

  console.log(username, transcription, 'user-transcriptions-rendering');

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
