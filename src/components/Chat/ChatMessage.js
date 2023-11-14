function ChatMessage({ content }) {
    return (
      <div className={`chatMessage ${content.role}`}>
        <span>{content.content}</span>
      </div>
    );
  }
  
  export default ChatMessage;