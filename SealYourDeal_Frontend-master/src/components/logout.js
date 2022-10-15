import React from "react";
import { googleLogout } from "@react-oauth/google";
import { Button } from "react-bootstrap";
import "./loggingbutton.css";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Logout({ setUser }) {
  const onSuccess = () => {
    googleLogout(); // helper for logging out
    setUser(null);
    localStorage.setItem("login", null); // clearing local storage
    console.log("Logout made successfully");
  };

  return (
    <div>
      <button className="logout-button" onClick={onSuccess}>
        Logout
      </button>
    </div>
  );
}

export default Logout;
