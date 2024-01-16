// import React, { useState } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { EduStreamUI } from '@/infra/stores/common/stream/struct';
// import { observer } from 'mobx-react';
// import transcriptStore from '@/infra/stores/common/TranscriptStore';

// const Transcript = observer(({ stream }: { stream: EduStreamUI }) => {
//     const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

//     const toggleListening = () => {
//         if (listening) {
//             SpeechRecognition.stopListening();
//         } else {
//             SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
//         }
//     };

//     React.useEffect(() => {
//         const { userName } = stream.stream.fromUser;
//         transcriptStore.addTranscript(userName, transcript);
//     }, [transcript, stream.stream.fromUser.userName]);

//     if (!browserSupportsSpeechRecognition) {
//         return null;
//     }

//     return (
//         <div className="transcript-container">
//             <div className="transcript-header">
//                 <h1>{stream.stream.fromUser.userName}</h1>
//                 {stream.stream.fromUser.role === 'host' && (
//                     <button
//                         className={`toggle-button bg-${listening ? 'red' : 'blue'}-500 text-white px-4 py-2 rounded-md`}
//                         onClick={toggleListening}
//                     >
//                         {listening ? 'Stop' : 'Start'}
//                     </button>
//                 )}
//             </div>
//             <div className="transcript-body">
//                 <div className="transcript-entry">
//                     <span className="speaker">{stream.stream.fromUser.userName}:</span>
//                     <p>{transcript}</p>
//                 </div>
//                 {transcriptStore.transcriptArray.map((item, index) => (
//                     <div key={index} className="transcript-entry">
//                         <span className="speaker">{item.userName}:</span>
//                         <p>{item.transcript}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// });

// export default Transcript;


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
    <div className="p-4">
      <p className="mb-2">
        <span className="font-bold mr-2">{stream.stream.fromUser.userName}:</span>
        <span className="font-bold">{currentTranscription}</span>
      </p>
    </div>
  );
});

export default Transcript;
