import React from "react";
import { withRouter } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  props.history.listen(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    
  });

  return <div></div>;
};

export default withRouter(AuthVerify);
