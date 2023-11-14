import React, { useState } from 'react';
import axios from 'axios';
import ChatForm from './ChatForm';
import Header from './Header';
import AnswerSec from './Answer';
import './App.css';

const ChatMain2 = () => {
  const [messages, setMessages] = useState([]);

  const responseGenerate = async (inputText, setInputText) => {
    const data = {
      model: 'text-davinci-003',
      prompt: inputText,
      max_tokens: 50,
      n: 1,
      stop: ".",
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });

      if (response.data.choices) {
        setMessages([
          {
            question: inputText,
            answer: response.data.choices[0].text,
          },
          ...messages,
        ]);
        setInputText("");
      }
    } catch (error) {
      console.error("Error in ChatGPT API call:", error);
    }
  };

  return (
    <div className="chatMain">
      <Header />
      <ChatForm responseGenerate={responseGenerate} />
      <AnswerSec messages={messages} />
    </div>
  );
};

export default ChatMain2;