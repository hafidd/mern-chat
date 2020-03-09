import axios from "axios";
import {
  CHATS_LOADING,
  CHATS_LOADED,
  CHATS_ERROR,
  SET_ACTIVE_CHAT,
  UPDATE_MESSAGES,
  GROUP_CREATED,
  NEW_MEMBER,
  ADDED_TO_GROUP
} from "./types";
import { headers } from "../helpers/jwt";
import { clearErrors, returnErrors } from "./errorAction";

export const loadChats = () => dispatch => {
  dispatch({ type: CHATS_LOADING });
  axios
    .get("/api/chat", headers())
    .then(res => {
      dispatch(clearErrors());
      dispatch({ type: CHATS_LOADED, payload: res.data });
    })
    .catch(err => {
      dispatch(returnErrors(err, "CHATS_ERROR"));
      dispatch({ type: CHATS_ERROR });
    });
};

export const setActiveChat = chat => dispatch => {
  // get full messages
  axios.get(`/api/chat/${chat._id}`, headers()).then(res => {
    //chat.messages = res.data.messages;
    dispatch({ type: SET_ACTIVE_CHAT, payload: res.data });
  });
};

export const updateMessages = message => dispatch => {
  dispatch({
    type: UPDATE_MESSAGES,
    payload: { ...message, date: new Date().toISOString() }
  });
};

export const createGroup = name => dispatch => {
  dispatch({ type: CHATS_LOADING });
  axios
    .post("/api/chat", { name, type: "group" }, headers())
    .then(res => {
      dispatch({ type: GROUP_CREATED, payload: res.data });
      dispatch({ type: SET_ACTIVE_CHAT, payload: res.data });
    })
    .catch(err => returnErrors(err, "CREATE_GROUP_ERROR"));
};

export const privateMessage = userId => dispatch => {
  dispatch({ type: CHATS_LOADING });
  axios
    .post("/api/chat", { type: "private", userId }, headers())
    .then(res => {
      if (res.data.new)
        dispatch({ type: GROUP_CREATED, payload: res.data.chat });
      dispatch({ type: SET_ACTIVE_CHAT, payload: res.data.chat });
      dispatch(clearErrors());
    })
    .catch(err => dispatch(returnErrors(err, "PM_ERROR")));
};

export const invite = (username, groupId) => dispatch => {
  axios
    .post("/api/chat/invite", { username, groupId }, headers())
    .then(res => {
      dispatch({ type: NEW_MEMBER, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch(returnErrors(err, "INVITE_ERROR"));
    });
};

export const newMember = user => dispatch => {
  dispatch({ type: NEW_MEMBER, payload: user });
};

//
export const added = group => dispatch => {
  dispatch({ type: ADDED_TO_GROUP, payload: group });
};
