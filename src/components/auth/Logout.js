import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/authActions";

export default function() {
  const dispatch = useDispatch();
  return (
    <button
      className="btn"
      onClick={() => window.confirm("Logout?") && dispatch(logout())}
    >
      <span className="navbar-light">
        <img src="/images/out.png" alt="logout" style={{ height: "4vh" }} />
      </span>
    </button>
  );
}
