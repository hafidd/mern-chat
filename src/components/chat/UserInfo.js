import React, { Fragment } from "react";
import Logout from "../auth/Logout";
import { useSelector } from "react-redux";

export default function UserInfo({
  collapse,
  setCollapse,
  showModal,
  className = ""
}) {
  const user = useSelector(state => state.auth.user);
  return (
    <div className={`user-info ${className}`}>
      <button
        className={`btn d-md-none`}
        onClick={() => setCollapse(!collapse)}
      >
        <span className="navbar-light">
          <span className="navbar-toggler-icon"></span>
        </span>
      </button>
      <span className="user-info-text">{user.name}</span>
      <span className="float-right">
        <ChatMenu showModal={showModal} />
        <Logout />
      </span>
    </div>
  );
}

function ChatMenu({ showModal }) {
  const s = { fontSize: "3vh" };
  return (
    <Fragment>
      <span className="navbar-light">
        <button
          className="btn"
          onClick={() => {
            showModal("newgroup");
          }}
        >
          <span style={s}>+</span>
        </button>
        <button
          className="btn"
          onClick={() => {
            showModal("contacts");
          }}
        >
          <span style={s} role="img" aria-label="a">💬</span>
        </button>
      </span>
    </Fragment>
  );
}
