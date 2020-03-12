import React from "react";
import { useSelector } from "react-redux";

export default function ChatInfo({ chat, showModal }) {
  const { name, type, members } = chat;
  const myName = useSelector(state => state.auth.user.name);
  const groupName =
    type === "group"
      ? name
      : name.split("__")[0] === myName
      ? name.split("__")[1]
      : name.split("__")[0];
  return (
    <div className="chat-info pl-2">
      <div>
        <p className="mb-0">
          <b>{groupName}</b>
        </p>
        {type === "group" && (
          <small>
            {members.length} Anggota | Online (
            {members.reduce((on, member) => on + (member.online ? 1 : 0), 0)})
          </small>
        )}
      </div>
      <div className="chat-info-menu">
        {type === "group" && (
          <button
            className="btn"
            onClick={() => showModal("chat-settings", groupName)}
          >
            <span className="menu-icon"></span>
          </button>
        )}
      </div>
    </div>
  );
}
