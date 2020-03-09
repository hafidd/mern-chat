import { combineReducers } from "redux";
import authReducer from "./authReducer";
import contactsReducer from "./contactsReducer";
import errorReducer from "./errorReducer";
import chatsReducer from "./chatsReducer";
import activeChatReducer from "./activeChatReducer";

export default combineReducers({
  auth: authReducer,
  contacts: contactsReducer,
  error: errorReducer,
  chats: chatsReducer,
  activeChat: activeChatReducer
});
