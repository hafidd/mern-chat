import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ChatMessages({ messages }) {
  const end = useRef(null);
  const id = useSelector(state => state.auth.user._id);
  useEffect(() => {
    end.current.scrollIntoView();
  }, [messages]);
  return (
    <div className="chat-messages">
      {messages.map((message, i) => (
        <div
          className={`chat-item ${
            message.from
              ? message.from === id && "chat-item-right"
              : "chat-item-center"
          }`}
          key={i}
        >
          {message.from && message.from !== id && message.name + ": "}
          {message.text}
        </div>
      ))}
      <div ref={end}></div>
    </div>
  );
}
