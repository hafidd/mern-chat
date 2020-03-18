import React from "react";
import { formatDate, formatTime } from "../../helpers/date";
import { useSelector } from "react-redux";
import { useState } from "react";
import Avatar from "./Avatar";

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
  const groupName =
    type === "group"
      ? name.substring(0, 28)
      : name.split("__")[0] === myName
      ? name.split("__")[1].substring(0, 28)
      : name.split("__")[0].substring(0, 28);

  return (
    <button
      className="list-group-item list-group-item-action p-2"
      onClick={() => setChat(chat)}
    >
      <Avatar data={{ ...chat, name: groupName }} />
      <div>
        <div className="m-0">
          <b>{groupName}</b>
          <div className="float-right small text-right">
            {message && formatDate(message.date)} <br />
            {message && formatTime(message.date)}
          </div>
        </div>
        <p className="m-0">
          <small>
            {message && message.name !== "System" && `${message.name}: `}
            {message && message.text.substring(0, 30)}
          </small>
        </p>
      </div>
    </button>
  );
}
