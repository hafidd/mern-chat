import axios from "axios";
import {
  CHATS_LOADING,
  CHATS_LOADED,
  CHATS_ERROR,
  SET_ACTIVE_CHAT,
  UPDATE_MESSAGES,
  GROUP_CREATED,
  NEW_MEMBER,
  ADDED_TO_GROUP,
  GROUP_DELETED,
  LEAVE_CHAT,
  MEMBER_LEFT,
  MEMBER_REMOVED,
  MEMBER_ONLINE,
  MEMBER_OFFLINE
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
export const closeActiveChat = () => dispatch => dispatch({ type: LEAVE_CHAT });

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
    .then(() => dispatch(clearErrors()))
    .catch(err => dispatch(returnErrors(err, "INVITE_ERROR")));
};
export const newMember = user => dispatch =>
  dispatch({ type: NEW_MEMBER, payload: user });

export const added = group => dispatch => {
  dispatch({ type: ADDED_TO_GROUP, payload: group });
};

export const deleteGroup = id => dispatch => {
  axios
    .delete(`/api/chat/${id}`, headers())
    .then(() => dispatch(clearErrors()))
    .catch(err => dispatch(returnErrors(err, "ERROR_DELETE_GROUP")));
};
export const groupDeleted = id => dispatch => {
  dispatch({ type: LEAVE_CHAT });
  dispatch({ type: GROUP_DELETED, payload: id });
};

export const leaveChat = gId => dispatch => {
  axios
    .post("/api/chat/leave", { _id: gId }, headers())
    .then(res => {
      dispatch(groupDeleted(gId));
      dispatch(clearErrors());
    })
    .catch(err => returnErrors(err, "ERROR_LEAVING_CHAT"));
};
export const memberLeft = uId => dispatch =>
  dispatch({ type: MEMBER_LEFT, payload: uId });

export const removeMember = (gId, uId) => dispatch => {
  axios
    .post("/api/chat/remove", { gId, uId }, headers())
    .then(() => dispatch(clearErrors()))
    .catch(err => returnErrors(err, "ERROR_REMOVING_MEMBER"));
};
export const memberRemoved = uId => dispatch =>
  dispatch({ type: MEMBER_REMOVED, payload: uId });

export const memberOnline = id => dispatch =>
  dispatch({ type: MEMBER_ONLINE, payload: id });
export const memberOffline = id => dispatch =>
  dispatch({ type: MEMBER_OFFLINE, payload: id });
