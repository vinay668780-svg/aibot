let currentAudio: HTMLAudioElement | null = null;

/**
 * Speaks text using server Gemini TTS (gemini-3.8-flash-lite-tts) if available,
 * or browser Web Speech API (window.speechSynthesis) as an instant reliable fallback.
 */
export async function playSpeech(
  text: string,
  voiceGender: 'female' | 'male' = 'female',
  onStart?: () => void,
  onEnd?: () => void
): Promise<() => void> {
  // Stop any currently playing audio or speech
  stopAllSpeech();

  onStart?.();

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceGender })
    });
    const data = await res.json();

    if (data.audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      currentAudio = audio;
      audio.onended = () => {
        currentAudio = null;
        onEnd?.();
      };
      audio.onerror = () => {
        currentAudio = null;
        fallbackSpeak(data.cleanText || text, voiceGender, onEnd);
      };
      await audio.play();
      return () => {
        audio.pause();
        currentAudio = null;
        onEnd?.();
      };
    } else {
      return fallbackSpeak(data.cleanText || text, voiceGender, onEnd);
    }
  } catch (err) {
    console.warn('Server TTS failed, falling back to browser synthesis:', err);
    return fallbackSpeak(text, voiceGender, onEnd);
  }
}

function fallbackSpeak(
  text: string,
  voiceGender: 'female' | 'male',
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return () => {};
  }

  // Clean Markdown characters
  const clean = text
    .replace(/###\s+/g, '')
    .replace(/##\s+/g, '')
    .replace(/#\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/[-*]\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .slice(0, 450);

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.0;
  utterance.pitch = voiceGender === 'female' ? 1.05 : 0.95;

  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(v =>
    voiceGender === 'female'
      ? v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Victoria')
      : v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Alex')
  );
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
    onEnd?.();
  };
}

export function stopAllSpeech() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Initializes browser speech recognition for hands-free voice search.
 */
export function startVoiceRecognition(
  onTranscript: (transcript: string, isFinal: boolean) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    onEnd();
    return () => {};
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        onTranscript(final, true);
      } else if (interim) {
        onTranscript(interim, false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      if (event.error === 'not-allowed') {
        onError('Microphone permission was denied. Please allow microphone access.');
      } else if (event.error !== 'no-speech') {
        onError(`Voice recognition error: ${event.error}`);
      }
      onEnd();
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // Ignore stop error
      }
    };
  } catch (err: any) {
    onError('Unable to initiate microphone recording.');
    onEnd();
    return () => {};
  }
}
