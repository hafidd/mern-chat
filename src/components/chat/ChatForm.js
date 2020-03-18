import React from "react";
import { useState } from "react";

export default function ChatForm({ sendMessage }) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);

  const handleTextArea = e => {
    setRows(Math.floor((e.target.scrollHeight - 44) / 24 + 1));
    setText(e.target.value);
  };

  return (
    <div className="message-form">
      <form
        onSubmit={e => {
          e.preventDefault();
          if (text) sendMessage(text);
          setRows(1);
          setText("");
        }}
      >
        <textarea
          rows={rows}
          value={text}
          onChange={e => handleTextArea(e)}
        ></textarea>
        <button>
          <span style={{ fontSize: "200%" }}>➤</span>
        </button>
      </form>
    </div>
  );
}
