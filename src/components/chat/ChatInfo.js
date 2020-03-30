import React from "react";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";

export default function ChatInfo({ chat, showModal }) {
  const { _id, uId, name, type, members } = useSelector(
    state => state.activeChat
  );
  const myName = useSelector(state => state.auth.user.name);
  const groupName =
    type === "group"
      ? name
      : name.split("__")[0] === myName
      ? name.split("__")[1]
      : name.split("__")[0];
  return (
    <div className="chat-info pl-2">
      <div className="test" onClick={() => showModal("upload-group")}>
        <Avatar data={{ name: groupName, type, _id, uId }} />
      </div>
      <div className="chat-info-text">
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
