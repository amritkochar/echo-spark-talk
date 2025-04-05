
import { useState, useEffect, useCallback } from "react";

// Add TypeScript interfaces for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: Event) => void;
}

// Define the global SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Extend Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface UseVoiceRecognitionOptions {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  continuous?: boolean;
}

export const useVoiceRecognition = (options: UseVoiceRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(false);

  // Mock audio level for demo until we can get actual audio levels
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.5 + 0.2); // Random value between 0.2 and 0.7
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionConstructor) {
        setIsSupported(true);
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = options.continuous ?? false;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("");
          
          setTranscript(transcript);
          options.onResult?.(transcript);
        };
        
        recognition.onend = () => {
          if (isListening) {
            recognition.start();
          } else {
            options.onEnd?.();
          }
        };
        
        setRecognition(recognition);
      } else {
        setIsSupported(false);
        console.error("Speech recognition not supported in this browser");
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [options.continuous, options.onEnd, options.onResult]);
  
  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition", error);
      }
    }
  }, [recognition]);
  
  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);
  
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    audioLevel,
    isSupported,
  };
};

export default useVoiceRecognition;
