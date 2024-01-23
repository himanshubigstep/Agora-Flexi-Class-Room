import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { EduStreamUI } from '@/infra/stores/common/stream/struct';
import transcriptionStore from '@/infra/stores/common/TranscriptStore';
import annyang from 'annyang';
import { useStore } from '@/infra/hooks/ui-store';

const Transcript = observer(({ stream }: { stream: EduStreamUI }) => {
  const {
    pretestUIStore: { currentPlaybackDeviceId },
  } = useStore();

  console.log(currentPlaybackDeviceId, 'testing-current-device')
  const [transcriptions, setTranscriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const startSpeechRecognition = () => {
      annyang.addCallback('result', (phrases: string[]) => {
        const newTranscription = phrases[0];
        const userName = stream.stream.fromUser.userName;

        console.log('Received transcription:', newTranscription, userName);

        // Update the transcription only for the current user
        setTranscriptions(prevTranscriptions => ({
          ...prevTranscriptions,
          [userName]: newTranscription,
        }));

        transcriptionStore.addTranscription(newTranscription, userName);
      });

      annyang.addCallback('error', (error: any) => {
        console.error('Speech recognition error:', error);
      });

      annyang.start();
    };

    startSpeechRecognition();

    return () => {
      annyang.abort();
    };
  }, [stream.stream.fromUser.userName]);

  // Cleanup when the component unmounts or when a user leaves the room
  useEffect(() => {
    return () => {
      annyang.abort();
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
      {currentPlaybackDeviceId && stream.stream.fromUser.userName && (
      <p className="mb-2">
        {Object.keys(transcriptions).map(userName => (
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
