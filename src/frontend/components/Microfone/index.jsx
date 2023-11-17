
import { useState, useRef } from 'react';

export default function Microphone() {
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        audioRef.current.src = URL.createObjectURL(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar a gravação:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      audioChunks.current = [];
    }
  };

  return (
    <div>
      <h2>Microfone</h2>
      <button onClick={startRecording} disabled={isRecording}>
        Iniciar Gravação
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Parar Gravação
      </button>
      <audio ref={audioRef} controls></audio>
    </div>
  );
}
