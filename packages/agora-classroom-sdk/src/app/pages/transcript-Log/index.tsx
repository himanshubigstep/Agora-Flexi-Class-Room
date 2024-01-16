import React from 'react'
import transcriptionStore from '@/infra/stores/common/TranscriptStore'

const TranscriptLog = () => {
    const transcripts = transcriptionStore.transcriptions
    const userNames = transcriptionStore.userNames
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
        </div>
    )
}
export default TranscriptLog