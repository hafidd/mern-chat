import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function({ submitInvite }) {
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState("");
  // redux
  const error = useSelector(state => state.error);
  const members = useSelector(state => state.activeChat.members).map(
    ({ _id }) => _id
  );
  const contacts = useSelector(state => state.contacts);

  const submit = e => {
    e.preventDefault();
    if (username) submitInvite(username);
    setUsername("");
  };

  const data = filter
    ? contacts.filter(
        contact =>
          contact.username.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
          contact.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      )
    : contacts;

  return (
    <div>
      {error.msg && <div className="alert alert-danger">{error.msg}</div>}
      <form onSubmit={e => submit(e)}>
        <input
          type="text"
          className="form-control mb-1"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button className="btn btn-outline-primary btn-block">Tambahkan</button>
      </form>
      <hr />
      <p className="m-0">Dari daftar kontak</p>
      {contacts.length === 0 && (
        <p className="small text-muted">Belum ada kontak</p>
      )}
      <input
        type="text"
        className="form-control mb-1"
        placeholder="cari nama / username"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul className="list-group">
        {data.map(contact => (
          <li key={contact.username} className="list-group-item p-1 pl-2">
            <div className="float-left">
              <p className="mb-0">{contact.name}</p>
              <small className="text-muted">{contact.username}</small>
            </div>
            {members.indexOf(contact._id) === -1 && (
              <button
                className="btn float-right"
                onClick={() => {
                  submitInvite(contact.username);
                }}
              >
                <span style={{ fontSize: "20px" }} role="img" aria-label="msg">
                  &#43;
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
