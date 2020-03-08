import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function({ submitInvite }) {
  const [username, setUsername] = useState("");
  // redux
  const error = useSelector(state => state.error);
  const { contacts } = useSelector(state => state.auth.user);

  const submit = e => {
    e.preventDefault();
    if (username) submitInvite(username);
    setUsername("");
  };
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
      <ul className="list-group">
        {contacts.map(contact => (
          <li className="list-group-item p-1 pl-2">
            {JSON.stringify(contact)}
            <button className="btn btn-sm btn-outline-primary">
              Tambahkan
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
