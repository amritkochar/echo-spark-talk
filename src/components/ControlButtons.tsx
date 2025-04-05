
import React from "react";
import { Volume2, VolumeX, PhoneOff } from "lucide-react";

interface ControlButtonsProps {
  isMuted: boolean;
  onMuteToggle: () => void;
  onDisconnect: () => void;
  isVisible: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isMuted,
  onMuteToggle,
  onDisconnect,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex gap-4 animate-fade-in mt-8">
      <button
        onClick={onMuteToggle}
        className="control-button"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>
      <button
        onClick={onDisconnect}
        className="control-button bg-destructive"
        aria-label="Disconnect"
      >
        <PhoneOff className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ControlButtons;
