import React, { useState } from "react";
import FontSelector from "./FontSelector.js";

export default function ChatForm({ addMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [fonts, setFonts] = useState("");

  const handleSubmit = (bla) => {
    bla.preventDefault();
    addMessage(inputValue);
    setInputValue("");
  };

  const handleFontChange = (selectedFont) => {
    setFonts([selectedFont]);
  };

  return (
    <div className="chatForm">
      <FontSelector onSelectFont={handleFontChange} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="chatFormInput"
          style={{ fontFamily: fonts[0] }}
          placeholder="Wpisz wiadomość..."
          value={inputValue}
          onChange={(bla) => setInputValue(bla.target.value)}
        />
        <button type="submit" className="chatFormSubmit">
          Wyślij wiadomość
        </button>
      </form>
      <div className="clearf9x" />
    </div>
  );
}
