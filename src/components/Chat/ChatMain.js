import React, { useState, useEffect } from "react";
import axios from 'axios';
import ChatMessageContainer from "./ChatMessageContainer.js";
import ChatForm from "./ChatForm.js";
import FontSelector from "./FontSelector.js";
import "../../assets/css/Chat.css"; 

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + API_KEY
};

const loadFromLocalStorage = () => {
  const chatHistory = localStorage.getItem('chatHistory');
  return chatHistory ? JSON.parse(chatHistory) : [];
};

const saveToLocalStorage = (chatHistory) => {
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
};

export default function ChatMain() {
  const [messages, setMessages] = useState([]);
  const [selectedFont, setSelectedFont] = useState("Arial, sans-serif");
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    const chatHistory = loadFromLocalStorage();
    setMessages(chatHistory);
  }, []);

  const addMessage = async (input) => {
    const userMessage = { role: 'user', content: input };

    let updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveToLocalStorage(updatedMessages);
  
    const data = {
      model: 'gpt-3.5-turbo',
      messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
    };
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        data, 
        { headers }
      );
  
      console.log("GPT Response:", response.data);
  
      if (response.data && response.data.choices[0]) {
        const aiMessage = { role: 'bot', content: response.data.choices[0].message.content.trim() };
  
        updatedMessages = [...updatedMessages, aiMessage];
        setMessages(updatedMessages);
        saveToLocalStorage(updatedMessages);
      }
    } catch (error) {
      console.error("Error in ChatGPT API call:", error);
    }
  }
      
  const handleFontChange = (selectedFont) => {
    setSelectedFont(selectedFont);
    if (!fonts.includes(selectedFont)) {
      setFonts([...fonts, selectedFont]);
    }
  };
  
  return (
    <div className="chatMain">
      <h1>Warhammer Bot v0.2</h1>
      <FontSelector onSelectFont={handleFontChange} />
      <div style={{ fontFamily: selectedFont }}>
        <ChatMessageContainer messages={messages} />
      </div>
      <ChatForm addMessage={addMessage} />
    </div>
  );
    }
