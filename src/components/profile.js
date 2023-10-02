export default function Profile() {
    return (
    <div className="ryba">
      <img
        src="https://i.imgur.com/MK3eW3Am.jpg"
        alt="Katherine Johnson"
      />
      <h1>ChatBot v0.1</h1>
      <button class="favorite styled" type="button">Add to favorites</button>
      <div className="grey-rectangle">
      <button className="send-button">Send Message</button>
      <input type="text" className="message-input" placeholder="Type your message..." />
      <div className="chat-history"></div>
      </div>
      </div>
    )
  }

  
  