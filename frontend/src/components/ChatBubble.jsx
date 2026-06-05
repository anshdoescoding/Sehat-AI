import React from 'react';

export default function ChatBubble({ message, isUser, timestamp }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap ${
          isUser
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
        {timestamp && (
          <p className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}