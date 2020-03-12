import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./App.css";

import { io, connect, disconnect } from "./io";

// components
import Chat from "./components/chat/Chat";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { loadUser } from "./actions/authActions";
import { useSelector, useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    // connect
    if (token) {
      connect(token);
    } else if (io) {
      disconnect();
    }
  }, [token]);

  // protected route
  const Protected = ({ path, lastPath, children, ...rest }) => {
    if (!isAuthenticated) return <Redirect to="/login" />;
    return (
      <Route path={path} {...rest}>
        {children}
      </Route>
    );
  };

  return (
    <div className="container-fluid" id="app">
      <Router>
        <Switch>
          <Protected exact path="/">
            <Chat />
          </Protected>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route path="*">
            <h1>Not found</h1>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
