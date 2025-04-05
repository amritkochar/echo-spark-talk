
import React, { useState, useEffect } from "react";
import MicButton from "@/components/MicButton";
import WaveAnimation from "@/components/WaveAnimation";
import ControlButtons from "@/components/ControlButtons";
import ConversationStatus from "@/components/ConversationStatus";
import useVoiceRecognition from "@/hooks/useVoiceRecognition";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [conversationStatus, setConversationStatus] = useState<
    "idle" | "listening" | "processing" | "speaking"
  >("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const { toast } = useToast();

  const { 
    isListening,
    toggleListening,
    stopListening,
    audioLevel,
    isSupported
  } = useVoiceRecognition({
    onResult: (transcript) => {
      console.log("Transcript:", transcript);
      // In a real app, you'd send this transcript to your API
    },
  });

  useEffect(() => {
    if (!isSupported) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }
  }, [isSupported, toast]);

  useEffect(() => {
    if (isListening) {
      setConversationStatus("listening");
      setIsConversationActive(true);
    } else if (!isConversationActive) {
      setConversationStatus("idle");
    }
  }, [isListening, isConversationActive]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: isMuted ? "You are now unmuted" : "You are now muted",
    });
  };

  const handleDisconnect = () => {
    stopListening();
    setIsConversationActive(false);
    setConversationStatus("idle");
    toast({
      title: "Disconnected",
      description: "Your conversation has ended",
    });
  };

  const handleStartConversation = () => {
    toggleListening();
    setIsConversationActive(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 rounded-3xl w-full max-w-md flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-center">CA Uncle</h1>
        <p className="text-muted-foreground text-center mb-6">
          {isConversationActive 
            ? "Your conversation is active" 
            : "Tap the mic to start a conversation"}
        </p>

        <WaveAnimation isListening={isListening} audioLevel={audioLevel} />
        
        <div className="mt-8 flex flex-col items-center">
          {!isConversationActive && (
            <MicButton isListening={isListening} onClick={handleStartConversation} />
          )}
          
          <ConversationStatus status={conversationStatus} />
          
          <ControlButtons 
            isMuted={isMuted}
            onMuteToggle={handleMuteToggle}
            onDisconnect={handleDisconnect}
            isVisible={isConversationActive}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
