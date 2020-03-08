import React from "react";
import { useState } from "react";

export default function ChatForm({ sendMessage }) {
  const [text, setText] = useState("");
  return (
    <div className="message-form">
      <form
        onSubmit={e => {
          e.preventDefault();
          if (text) sendMessage(text);
          setText("");
        }}
      >
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ketikkan pesan..."
        />
        <button>
          <span style={{ fontSize: "200%" }}>➤</span>
        </button>
      </form>
    </div>
  );
}
