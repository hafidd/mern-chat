import {
  AUTH_SUCCESS,
  AUTH_ERROR,
  LOGOUT_SUCCESS,
  USER_LOADING,
  USER_LOADED,
} from "../actions/types";

const initialState = {
  token: null,
  isAuthenticated: false,
  isLoading: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return { ...state, isLoading: true };
    case AUTH_SUCCESS:
    case USER_LOADED:
      //localStorage.setItem("token", action.payload.token);
      return {
        ...action.payload,
        isLoading: false,
        isAuthenticated: true
      };     
    case AUTH_ERROR:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return initialState;
    default:
      return state;
  }
}
