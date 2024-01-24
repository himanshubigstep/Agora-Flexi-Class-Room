import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';
import { useStore } from '@/infra/hooks/ui-store';

interface TranscriptProps {
  stream: EduStreamUI;
}

const Transcript: React.FC<TranscriptProps> = observer(({ stream }) => {
  const {
    pretestUIStore: { currentPlaybackDeviceId },
  } = useStore();

  console.log(currentPlaybackDeviceId, 'testing-current-device');
  const [transcription, setTranscription] = useState<string | null>(null);

  useEffect(() => {
    const recognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!recognition) {
      console.error('SpeechRecognition API not supported in this browser');
      return;
    }

    try {
      const recognitionInstance = new recognition();

      recognitionInstance.lang = 'en-IN';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const newTranscription = event.results[0][0].transcript;
        setTranscription(newTranscription);
        transcriptionStore.addTranscription(newTranscription, stream.stream.fromUser.userName);
      };

      recognitionInstance.onend = () => {
        // Restart recognition after it ends
        recognitionInstance.start();
      };

      // Start speech recognition
      recognitionInstance.start();

      // Cleanup: Stop recognition when the component unmounts
      return () => {
        recognitionInstance.stop();
      };
    } catch (error) {
      console.error('Error initializing SpeechRecognition:', error);
    }
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
          <span className="font-bold">{stream.stream.fromUser.userName}:</span>
          <span className="ml-2">{transcription}</span>
        </div>
      )}
    </div>
  );
});

export default Transcript;
