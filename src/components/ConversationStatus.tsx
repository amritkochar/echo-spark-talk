
import React from "react";

interface ConversationStatusProps {
  status: "idle" | "listening" | "processing" | "speaking";
}

const ConversationStatus: React.FC<ConversationStatusProps> = ({ status }) => {
  const statusMessages = {
    idle: "Tap to start conversation",
    listening: "Listening...",
    processing: "Processing...",
    speaking: "Speaking...",
  };

  return (
    <div className="text-center mt-4">
      <p className="text-muted-foreground text-sm font-medium">
        {statusMessages[status]}
      </p>
    </div>
  );
};

export default ConversationStatus;
