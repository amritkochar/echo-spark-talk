
import React from "react";
import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ isListening, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`mic-button transition-all duration-300 ${
        isListening ? "bg-primary" : "bg-secondary"
      }`}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <Mic className="w-8 h-8" />
      ) : (
        <Mic className="w-8 h-8" />
      )}
    </button>
  );
};

export default MicButton;
