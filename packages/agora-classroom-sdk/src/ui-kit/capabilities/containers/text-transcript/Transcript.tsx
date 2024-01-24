import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';
import { useStore } from '@/infra/hooks/ui-store';

const Transcript = observer(({ stream }: { stream: EduStreamUI }) => {
  const {
    pretestUIStore: { currentPlaybackDeviceId },
  } = useStore();

  console.log(currentPlaybackDeviceId, 'testing-current-device');
  const [transcriptions, setTranscriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let recognition;
  
    const startSpeechRecognition = () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
  
        recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const newTranscription = event.results[i][0].transcript;
            const userName = stream.stream.fromUser.userName;
  
            console.log('Received transcription:', newTranscription, userName);
  
            // Update the transcription only for the current user
            setTranscriptions((prevTranscriptions) => ({
              ...prevTranscriptions,
              [userName]: newTranscription,
            }));
  
            transcriptionStore.addTranscription(newTranscription, userName);
          }
        };
  
        recognition.onerror = (error) => {
          console.error('Speech recognition error:', error);
        };
  
        recognition.start();
      } else {
        console.error('Speech recognition not supported in this browser');
      }
    };
  
    startSpeechRecognition();
  
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Cleanup when the component unmounts or when a user leaves the room
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

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
      {currentPlaybackDeviceId && stream.stream.fromUser.userName && (
        <p className="mb-2">
          {Object.keys(transcriptions).map((userName) => (
            <span key={userName} className="font-bold mr-2">
              {userName}: {transcriptions[userName]}
            </span>
          ))}
        </p>
      )}
    </div>
  );
});

export default Transcript;
