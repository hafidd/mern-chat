import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  deleteGroup,
  leaveChat,
  removeMember
} from "../../../actions/chatsActions";
import Avatar from "../Avatar";

export default function({ showModal }) {
  const [filter, setFilter] = useState("");
  const [showDelBtn, setShowDelBtn] = useState(false);

  const { name, members, owner, _id } = useSelector(state => state.activeChat);
  const myId = useSelector(state => state.auth.user._id);
  const dispatch = useDispatch();

  useEffect(() => {
    setShowDelBtn(false);
  }, [_id]);

  const data = filter
    ? members.filter(
        member =>
          member.username.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
          member.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      )
    : members;

  return (
    <Fragment>
      <p className="mb-1">
        <b>
          Anggota ({members.length})
          {owner === myId && (
            <button
              className="ml-2 btn btn-sm btn-outline-dark p-0 pr-1 pl-1"
              onClick={() => {
                showModal("invite-member");
              }}
            >
              <span>&#43;</span>
            </button>
          )}
        </b>
      </p>
      <input
        type="text"
        className="form-control mb-1"
        placeholder="cari nama / username"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul className="list-group">
        {data.map(member => (
          <li key={member.username} className="list-group-item p-1 pl-2">
            <div className="float-left">
              <Avatar member={member} />
              <div className="user-name float-right">
                <p className="mb-0">{member.name}</p>
                <small className="text-muted">
                  {member.username} {member.online && "(online)"}
                </small>
              </div>
            </div>
            {myId === owner && (
              <div className="float-right">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    const ok = window.confirm(
                      `Keluarkan ${member.name} (${member.username}) dari grup?`
                    );
                    if (ok) dispatch(removeMember(_id, member._id));
                  }}
                >
                  x
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="text-right mt-2">
        <button
          className="btn pt-0 pb-0 mr-2"
          onClick={e => setShowDelBtn(!showDelBtn)}
        >
          {showDelBtn ? <span>&laquo;</span> : <span>&raquo;</span>}
        </button>
        {showDelBtn && myId === owner ? (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              const ok = window.confirm(`Bubarkan grup "${name}"?`);
              if (ok) dispatch(deleteGroup(_id));
            }}
          >
            Bubarkan
          </button>
        ) : (
          showDelBtn &&
          myId !== owner && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                const ok = window.confirm(`Keluar dari grup "${name}"?`);
                if (ok) dispatch(leaveChat(_id));
              }}
            >
              Keluar
            </button>
          )
        )}
      </div>
    </Fragment>
  );
}
