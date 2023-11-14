import ChatMessage from "./ChatMessage.js"

export default function ChatMessageContainer({messages}) {
    return (
        <ul className="chatMessageContainer">
{messages.map((message, index) => (
  <ChatMessage key={index} content={message} />
))}
    </ul>
    )
}
