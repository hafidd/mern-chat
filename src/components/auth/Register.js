import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { register } from "../../actions/authActions";
import { newErrors, clearErrors } from "../../actions/errorAction";
import { useEffect } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const error = useSelector(state => state.error);
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearErrors);
  }, [dispatch]);

  const submit = e => {
    e.preventDefault();
    if (password !== password2)
      return dispatch(
        newErrors(
          {
            msg: "Validation Error",
            errors: ["Konfirmasi password tidak sama"]
          },
          "REGISTER_FAIL"
        )
      );
    dispatch(register({ username, password, email, name }));
  };

  if (isAuthenticated) return <Redirect to="/" />;
  return (
    <div className="row auth-container p-5">
      <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
        <h2>Register</h2>
        {JSON.stringify(error)}
        <form onSubmit={e => submit(e)}>
          <div className="form-group row">
            <label className="col-form-label col-md-3" htmlFor="username">
              Username
            </label>
            <input
              placeholder="Username"
              type="text"
              className="form-control col-md-9"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group row">
            <label className="col-form-label col-md-3" htmlFor="email">
              Email
            </label>
            <input
              placeholder="Email"
              type="email"
              className="form-control col-md-9"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group row">
            <label className="col-form-label col-md-3" htmlFor="name">
              Nama
            </label>
            <input
              placeholder="Nama"
              type="text"
              className="form-control col-md-9"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="form-group row">
            <label className="col-form-label col-md-3" htmlFor="password">
              Password
            </label>
            <input
              placeholder="Password"
              type="password"
              className="form-control col-md-9"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group row">
            <label className="col-form-label col-md-3" htmlFor="password2">
              Konfirmasi Password
            </label>
            <input
              placeholder="Konfirmasi password"
              type="password"
              className="form-control col-md-9"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
            />
          </div>
          <div className="form-group row">
            <button className="btn btn-outline-success btn-block offset-md-3 col-md-3">
              Register
            </button>
            <div className="col-md-3 offset-3 col-form-label text-right">
              <Link to="/login">Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
