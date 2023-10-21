import React, { useState } from "react";
import ChatMessageContainer from "./ChatMessageContainer.js";
import ChatForm from "./ChatForm.js";
import FontSelector from "./FontSelector.js";
import "../../assets/Chat.css"; 

export default function ChatMain() {
  const [messages, setMessages] = useState([]);
  const [selectedFont, setSelectedFont] = useState("Arial, sans-serif");

  const [fonts, setFonts] = useState([]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  const handleFontChange = (selectedFont) => {
    setSelectedFont(selectedFont);
    if (!fonts.includes(selectedFont)) {
      setFonts([...fonts, selectedFont]);
    }
  };
  
  return (
    <div className="chatMain">
      <h1>Warhammer Bot v0.1c</h1>
      <FontSelector onSelectFont={handleFontChange} />
      <div style={{ fontFamily: selectedFont }}>
        <ChatMessageContainer messages={messages} />
      </div>
      <ChatForm addMessage={addMessage} />
    </div>
  );
}

/*
Importowanie modułów. 
React to moduł główny.
useState to funkcja pozwalająca na korzystanie z hooka stanu w komponencie
Następnie wczytywane są dwa moduły lokalne

Deklaracja komponentu chat.
Inicjujemy stan komponentu za pomocą hooka useState. Zmienna 'bla' przechowuje tablicę poczatkowych wartości 'setBla'.

Funkcja addMessage dodaje nowe wiadomości do stanu 'bla', dodaje wiadomości do istniejącej tablicy 'bla'.

Komponent chat składa się z kontenera <div>, nagłówka <h1>, komponentu ChatMessageContainer, który otrzymuje tablicę 'bla' jako właściwość 'messages'
oraz komponentu ChatForm, który otrzymuje funkcję 'addMessage' jako właściwość.
*/
