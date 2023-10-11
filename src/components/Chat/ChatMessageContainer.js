import ChatMessage from "./ChatMessage.js"

export default function ChatMessageContainer({messages}) {
    return (
        <ul className="chatMessageContainer">
            {messages.map(message=>(
        <ChatMessage content={message} />
        ))}
    </ul>
    )
}
