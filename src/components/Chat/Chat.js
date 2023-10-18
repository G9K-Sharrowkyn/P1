import React, { useState } from "react";
import ChatMessageContainer from "./ChatMessageContainer.js";
import ChatForm from "./ChatForm.js";

export default function Chat() {
  const [messages, setMessages] = useState(["str", "wpl", "dwdw", "werty", "dwdwdwdw"]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <div className="chat">
      <h1>ChatBot v0.1b</h1>
      <ChatMessageContainer messages={messages} />
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
