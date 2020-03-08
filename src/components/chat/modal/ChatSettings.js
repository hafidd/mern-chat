import React from "react";
import { useSelector } from "react-redux";

export default function({ showModal }) {
  const { members } = useSelector(state => state.activeChat);

  return (
    <div>
      <p className="mb-1">
        <b>
          Anggota ({members.length})
          <button
            className="ml-2 btn btn-sm btn-outline-dark p-0 pr-1 pl-1"
            onClick={() => {
              showModal("invite-member");
            }}
          >
            <span>&#43;</span>
          </button>
        </b>
      </p>
      <ul className="list-group">
        {members.map(member => (
          <li className="list-group-item p-1 pl-2">
            <p className="mb-0">{member.name}</p>
            <small className="text-muted">{member.username}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
