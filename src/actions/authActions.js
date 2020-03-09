import axios from "axios";
import { returnErrors, clearErrors, newErrors } from "./errorAction";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_SUCCESS,
  AUTH_ERROR,
  CLEAR_CHATS,
  LOGOUT_SUCCESS,
  CONTACTS_LOADED,
  CONTACTS_UPDATED
} from "../actions/types";
import { headers, getUser } from "../helpers/jwt";

// load user
export const loadUser = () => dispatch => {
  dispatch({ type: USER_LOADING });
  const user = getUser();
  if (user) {
    dispatch({ type: USER_LOADED, payload: user });
    return dispatch(getContacts());
  }
  dispatch(newErrors({ msg: "No token" }));
  dispatch({ type: AUTH_ERROR });
};

// register
export const register = ({ username, name, email, password }) => dispatch => {
  dispatch({ type: USER_LOADING });
  // request body
  const body = JSON.stringify({ username, name, email, password });
  // register
  axios
    .post("/api/users", body, headers())
    .then(res => {
      dispatch({ type: AUTH_SUCCESS, payload: getUser(res.data.token) });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch(returnErrors(err, "REGISTER_FAIL"));
      dispatch({ type: AUTH_ERROR });
    });
};

// login
export const login = ({ username, password }) => dispatch => {
  dispatch({ type: USER_LOADING });
  // req body
  const body = JSON.stringify({ username, password });
  // login
  axios
    .post("/api/users/auth", body, headers())
    .then(res => {
      localStorage.setItem("token", res.data.token);
      dispatch({
        type: AUTH_SUCCESS,
        payload: getUser(localStorage.getItem("token"))
      });
      dispatch(getContacts());
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch(returnErrors(err, "LOGIN_FAIL"));
      dispatch({ type: AUTH_ERROR });
    });
};

// get contacts
export const getContacts = () => dispatch => {
  axios
    .get("/api/users/contacts", headers())
    .then(res => dispatch({ type: CONTACTS_LOADED, payload: res.data }))
    .catch(err => returnErrors(err, "CONTACTS_ERROR"));
};

// new contact
export const newContact = username => dispatch => {
  axios
    .post("/api/users/contact", { username }, headers())
    .then(res => {
      dispatch({ type: CONTACTS_UPDATED, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => dispatch(returnErrors(err, "ADD_CONTACT_ERR")));
};

// logout
export const logout = () => dispatch => {
  dispatch({ type: USER_LOADING });
  // req invalidate token
  /* axios .... */

  dispatch({ type: CLEAR_CHATS });
  dispatch({ type: LOGOUT_SUCCESS });
};
