import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { login } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorAction";

import Welcome from "../Welcome";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const error = useSelector((state) => state.error);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  if (isAuthenticated) return <Redirect to="/" />;
  return (
    <div className="row auth-container">
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 card p-5">
        <Welcome />
        <hr />
        <form onSubmit={(e) => submit(e)} className="form">
          <div className="form-group row">
            <label className="col-md-3 col-form-label" htmlFor="username">
              Username
            </label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-md-3 col-form-label" htmlFor="password">
              Password
            </label>
            <div className="col-md-9">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-md-3 col-md-3">
              <button className="btn btn-outline-primary btn-block">
                Login
              </button>
            </div>
            <div className="col-md-3 offset-3 col-form-label text-right">
              <Link to="/register">Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
