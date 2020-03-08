import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {
  msg: "",
  errors: [],
  status: null,
  id: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        msg: action.payload.msg,
        errors: action.payload.errors,
        status: action.payload.status,
        id: action.payload.id
      };
    case CLEAR_ERRORS:
      return initialState;
    default:
      return state;
  }
}
