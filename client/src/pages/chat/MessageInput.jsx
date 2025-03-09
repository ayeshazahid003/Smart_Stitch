import React, { useState } from "react";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function MessageInput({ onSendMessage }) {
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="relative p-4 bg-white border-t flex items-center gap-2">
      {/* Emoji Picker */}
      <div className="relative">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2">
          <Smile className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-50 shadow-lg border rounded-lg bg-white">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-2 bg-gray-100 rounded-lg outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />

      {/* Send Button */}
      <button onClick={handleSend} className="p-2 hover:bg-gray-100 rounded-lg">
        <Send className="w-6 h-6 text-blue-500 cursor-pointer" />
      </button>
    </div>
  );
}

export default MessageInput;
