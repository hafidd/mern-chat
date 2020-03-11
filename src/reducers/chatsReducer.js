import {
  CHATS_LOADING,
  CHATS_LOADED,
  CHATS_ERROR,
  CLEAR_CHATS,
  UPDATE_MESSAGES,
  LOGOUT_SUCCESS,
  GROUP_CREATED,
  GROUP_DELETED,
  ADDED_TO_GROUP
} from "../actions/types";

const initialState = {
  data: [],
  isLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHATS_LOADING:
      return { ...state, isLoading: true };
    case CHATS_LOADED:
      return {
        data: action.payload,
        isLoading: false
      };
    case UPDATE_MESSAGES:
      let index = null;
      // update
      const newData = state.data.map((chat, i) => {
        if (chat._id === action.payload.room) {
          index = i;
          chat.message = action.payload;
          chat.messages = [...chat.messages, action.payload];
        }
        return chat;
      });
      // pindah ke awal
      newData.splice(0, 0, newData.splice(index, 1)[0]);
      return {
        isLoading: false,
        data: newData
      };
    case GROUP_CREATED:
    case ADDED_TO_GROUP:
      const { _id, name, type, messages } = action.payload;
      state.data.unshift({
        _id,
        name,
        type,
        messages,
        message: messages[0]
      });
      return {
        ...state,
        isLoading: false
      };
    case GROUP_DELETED:
      return {
        isLoading: false,
        data: state.data.filter(data => data._id !== action.payload)
      };
    case CLEAR_CHATS:
    case CHATS_ERROR:
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
