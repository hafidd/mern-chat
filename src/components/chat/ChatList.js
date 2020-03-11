import React from "react";
import { formatDate, formatTime } from "../../helpers/date";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function ChatList({ setChat }) {
  const [filter, setFilter] = useState("");

  const chats = useSelector(state => state.chats.data);
  const data = filter
    ? chats.filter(
        chat => chat.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      )
    : chats;

  return (
    <div style={{ maxHeight: "82vh", overflowY: "auto" }}>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Cari..."
        style={{ height: "38px", fontSize: "20px" }}
        onChange={e => setFilter(e.target.value)}
      />
      <ul className="list-group">
        {data.map(chat => (
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
