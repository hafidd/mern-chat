import {
  SET_ACTIVE_CHAT,
  UPDATE_MESSAGES,
  LOGOUT_SUCCESS,
  NEW_MEMBER
} from "../actions/types";

const initialState = {
  _id: null,
  name: "",
  type: "",
  members: [],
  messages: [],
  isLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_CHAT:
      return { ...action.payload };
    case UPDATE_MESSAGES:
      return { ...state, messages: [...state.messages, action.payload] };
    case NEW_MEMBER:
      return { ...state, members: [...state.members, action.payload] };
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
