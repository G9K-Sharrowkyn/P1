import ChatForm from "./ChatForm.js";
import ChatMessageContainer from "./ChatMessageContainer.js"

export default function chat() {
    const bla= ["str","wpl","dwdw","werty"]

    return (
    <div className="chat">
        <h1> ChatBot v0.1 </h1>
        <ChatMessageContainer messages={bla} />
        <ChatForm />
      </div>
    )
  }
  