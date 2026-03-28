'use client';
import { useState, useRef } from 'react';
import { VoiceParsedDeal } from '@/types';

interface VoiceInputProps {
  onParsed: (deal: VoiceParsedDeal) => void;
}

export function VoiceInput({ onParsed }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'parsing' | 'done' | 'error'>('idle');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => { setListening(true); setStatus('listening'); };
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
    };
    recognition.onend = async () => {
      setListening(false);
      setStatus('parsing');
      try {
        const res = await fetch('/api/ai/voice-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript }),
        });
        const { deal } = await res.json();
        onParsed(deal);
        setStatus('done');
      } catch {
        setStatus('error');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => recognitionRef.current?.stop();

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500 mb-3">
        Speak your inventory: <em>"50 packets of bread, expiring tomorrow"</em>
      </p>

      <button
        type="button"
        onClick={listening ? stopListening : startListening}
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl transition-all ${
          listening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        {listening ? '⏹' : '🎙️'}
      </button>

      {transcript && (
        <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded p-2">"{transcript}"</p>
      )}

      {status === 'parsing' && <p className="mt-2 text-sm text-blue-600">AI is parsing...</p>}
      {status === 'done' && <p className="mt-2 text-sm text-green-600">✓ Deal auto-filled below</p>}
      {status === 'error' && <p className="mt-2 text-sm text-red-500">Parsing failed. Fill manually.</p>}
    </div>
  );
}
