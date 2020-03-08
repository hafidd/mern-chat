const decode = require("jwt-decode");

export function headers(paramToken = null) {
  const token = paramToken || localStorage.getItem("token");
  // headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  };
  // if token, add to headers
  if (token && !isExpired(token))
    config.headers["Authorization"] = `Bearer ${token}`;
  return config;
}

export function getUser(paramToken = null) {
  const token = paramToken || localStorage.getItem("token");
  if (!token || isExpired(token)) return null;
  const user = decode(token);
  // return token + user data
  return { token, user };
}

// check exp
export function isExpired(token) {
  const jwt = decode(token);
  const current_time = new Date().getTime() / 1000;
  return current_time > jwt.exp;
}
