import React, { useState } from "react";
import "./Join.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
const Join = () => {
  const [username, setUserName] = useState("");
  return (
    <div className="JoinPage">
      <div className="JoinContainer">
        <img src={logo} />
        <h1>WE CHAT</h1>
        <input
          type="text"
          id="joinInput"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          placeholder="Enter Your Name"
        />
        <Link
          // Preventing the user to submit empty username by using prevent default.
          onClick={(event) =>
            username == null || username == "" ? event.preventDefault() : null
          }
          to={"/chat"}
          state={{ username: username }}
        >
          <button className="joinbtn">LOGIN</button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
