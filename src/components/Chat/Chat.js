import React, { useState } from "react";
import ChatMessageContainer from "./ChatMessageContainer.js";
import ChatForm from "./ChatForm.js";

export default function Chat() {
  const [bla, setBla] = useState(["str", "wpl", "dwdw", "werty", "dwdwdwdw"]);

  const addMessage = (message) => {
    setBla([...bla, message]);
  };

  <body>
  <script src="./Alert.js"></script>
  </body>

  return (
    <div className="chat">
      <h1>ChatBot v0.1b</h1>
      <ChatMessageContainer messages={bla} />
      <ChatForm addMessage={addMessage} />
    </div>
  );
}
