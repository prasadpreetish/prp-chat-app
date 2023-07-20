import { useState,useEffect,useRef } from "react";
import io from "socket.io-client";
import Chat from "./Chat.jsx";

const socket = io.connect("http://192.168.85.15:3001",)

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username.trim() !== "" && room.trim() !== "") {
      socket.emit("join_room", room)
      setShowChat(!showChat)
    }
  }
  return (
    <>
      <div className="app" >
        {!showChat ? (
          <div className="joinchat-container">
            <h3>Join a Chat</h3>
            <input type="text" placeholder="Username" onChange={(e) => { setUsername(e.target.value) }} />
            <input type="text" placeholder="Room Id" onChange={(e) => { setRoom(e.target.value) }} />
            <button onClick={joinRoom}>Join Room</button>
          </div>)
          :
          (<Chat socket={socket} username={username} room={room} />)
        }
      </div>
    </>
  );
}

export default App;
