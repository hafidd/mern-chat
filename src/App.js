import React, { useEffect } from "react";
import socketio from "socket.io-client";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./App.css";

// components
import Chat from "./components/chat/Chat";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { loadUser } from "./actions/authActions";
import { useSelector, useDispatch } from "react-redux";

let io;

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    // connect
    if (token)
      io = socketio.connect(`http://192.168.43.65:5001?token=${token}`);
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
            <Chat io={io} />
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
