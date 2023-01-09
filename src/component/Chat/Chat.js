import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Chat.css";
import sendImage from "../../img/send.png";
import socketIO from "socket.io-client";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../img/closeIcon.png";

const ENDPOINT = `https://chat-app-server-ag89.onrender.com/`;
// `http://localhost:4500/`;
let socket;
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const state = location.state;
  const username = state.username;
  const [id, setId] = useState("");
  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };
  console.log(messages);
  // Use Effect return a clean up function which is executed when the component unmount.
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      alert("Connected");
      setId(socket.id);
    });

    // Joined is our named event we can put any name here.
    socket.emit("joined", { username });

    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log("Welcome ", data.user, data.message);
    });

    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log("userJoined ", data.user, data.message);
    });

    socket.on("leave", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.emit("disconnected");
      socket.off();
    };
  }, []);

  /**
   * If we don't pass any value in second parameter of use effect then it will
   * run our effect only once which obstructs our array from adding messages.
   * Instead it going to add the value to an empty array of message because
   * state messages is created with an empty array.
   **/

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
      console.log("Send Message ", data.user, data.message);
    });

    return () => {
      //   socket.off();
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>WE CHAT</h2>
          <br />
          <a href="/">
            <img src={closeIcon} alt="Close" />
          </a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item) => {
            return (
              <Message
                message={item.message}
                user={item.id === id ? "" : item.user}
                classs={item.id === id ? "right" : "left"}
              />
            );
          })}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input
            type="text"
            id="chatInput"
            onKeyDown={(event) => (event.key === "Enter" ? send() : null)}
          />
          <button class="sendBtn" onClick={send}>
            <img src={sendImage} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
