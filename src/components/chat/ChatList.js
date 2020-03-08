import React, { useRef } from "react";
import { formatDate, formatTime } from "../../helpers/date";
import { useSelector } from "react-redux";

export default function ChatList({ chats, setChat }) {
  return (
    <div style={{ maxHeight: "82vh", overflowY: "auto" }}>
      <ul className="list-group">
        {chats.data.map(chat => (
          <ChatListItem key={chat._id} chat={chat} setChat={setChat} />
        ))}
      </ul>
    </div>
  );
}

function ChatListItem({ chat, setChat }) {
  const myName = useSelector(state => state.auth.user.name);
  const { name, message, type } = chat;
  return (
    <button
      className="list-group-item list-group-item-action p-2"
      onClick={() => setChat(chat)}
    >
      <p className="m-0">
        <b>
          {type === "group"
            ? name
            : name.split("__")[0] === myName
            ? name.split("__")[1]
            : name.split("__")[0]}
        </b>
      </p>
      <p className="m-0">
        <small>
          {message && message.name !== "System" && `${message.name}: `}
          {message && message.text}
        </small>
      </p>
      <small>{message && formatDate(message.date)}</small>
      <small className="float-right">
        {message && formatTime(message.date)}
      </small>
    </button>
  );
}
