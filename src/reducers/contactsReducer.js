import {
  CONTACTS_LOADED,
  CONTACTS_UPDATED,
  LOGOUT_SUCCESS
} from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case CONTACTS_LOADED:
      return action.payload;
    case CONTACTS_UPDATED:
      return [...state, action.payload];
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
