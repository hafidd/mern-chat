import {
  SET_ACTIVE_CHAT,
  UPDATE_MESSAGES,
  NEW_MEMBER,
  LEAVE_CHAT,
  MEMBER_LEFT,
  MEMBER_REMOVED,
  LOGOUT_SUCCESS
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
    case MEMBER_LEFT:
    case MEMBER_REMOVED:
      return {
        ...state,
        members: [
          ...state.members.filter(member => member._id !== action.payload)
        ]
      };
    case LEAVE_CHAT:
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
