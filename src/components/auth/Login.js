import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { login } from "../../actions/authActions";
import { useEffect } from "react";
import { clearErrors } from "../../actions/errorAction";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const error = useSelector(state => state.error);
  const { isAuthenticated } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const submit = e => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  if (isAuthenticated) return <Redirect to="/" />;
  return (
    <div className="row auth-container p-5">
      <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3">
        <h2>Login</h2>
        {JSON.stringify(error)}
        <form onSubmit={e => submit(e)}>
          <div className="form-group row">
            <label className="col-md-3 col-form-label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              className="form-control col-md-9"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group row">
            <label className="col-md-3 col-form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="form-control col-md-9"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group row">
            <button className="btn btn-outline-success btn-block offset-md-3 col-md-3">
              Login
            </button>
            <div className="col-md-3 offset-3 col-form-label text-right">
              <Link to="/register">Register</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
