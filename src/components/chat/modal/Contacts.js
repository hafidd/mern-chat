import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { newContact } from "../../../actions/authActions";
import { useEffect } from "react";
import { privateMessage } from "../../../actions/chatsActions";

export default function({ setModal }) {
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  // redux
  const error = useSelector(state => state.error);
  const contacts = useSelector(state => state.contacts);
  const dispatch = useDispatch();

  const submit = e => {
    e.preventDefault();
    if (username) dispatch(newContact(username));
    setUsername("");
  };
  
  useEffect(() => {
    setFilteredContacts(
      contacts.filter(
        contact =>
          contact.username.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
          contact.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
      )
    );
  }, [filter, contacts]);

  const data = filter ? filteredContacts : contacts;
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
      {contacts.length === 0 ? (
        <p className="small text-muted">Belum ada kontak</p>
      ) : (
        <input
          type="text"
          className="form-control mb-1"
          placeholder="cari nama / username"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      )}
      <ul
        className="list-group"
        style={{ maxHeight: "50vh", overflow: "auto" }}
      >
        {data.map((contact, i) => (
          <li key={contact.username + i} className="list-group-item p-1 pl-2">
            <div className="float-left">
              <p className="mb-0">{contact.name}</p>
              <small className="text-muted">{contact.username}</small>
            </div>
            <button
              className="btn float-right"
              onClick={() => {
                dispatch(privateMessage(contact._id));
                setModal(false);
              }}
            >
              <span style={{ fontSize: "20px" }} role="img" aria-label="msg">💬</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
