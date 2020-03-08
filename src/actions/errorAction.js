import { GET_ERRORS, CLEAR_ERRORS } from "./types";

// RETURN ERRORS (from request)
export const returnErrors = (err, id = null) => {
  console.log(err);
  return {
    type: GET_ERRORS,
    payload: {
      msg: err.response ? err.response.data.msg : "",
      errors: err.response ? err.response.data.errors : [],
      status: err.response ? err.response.status : null,
      id
    }
  };
};

// CLEAR ERRORS
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

// CREATE ERRORS
export const newErrors = ({ msg, errors }, id = null) => {
  return {
    type: GET_ERRORS,
    payload: {
      msg: msg || "Error",
      errors: errors || [],
      status: null,
      id
    }
  };
};
