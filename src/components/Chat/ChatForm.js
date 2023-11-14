import React from "react";

export default function ChatForm({ addMessage }) {
  const inputRef = React.useRef();

  const handleSubmit = (bla) => {
    bla.preventDefault();
    if (inputRef.current.value === '') {
      // alert ("Nie wpisano wiadomości.");

      return;
    }

    addMessage(inputRef.current.value);
    inputRef.current.value = '';
  };

  return (
    <div className="chatForm">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="chatFormInput"
          placeholder="Wpisz wiadomość..."
        />
        <button type="submit" className="chatFormSubmit">
          Wyślij wiadomość
        </button>
      </form>
      <div className="clearf9x" />
    </div>
  );
}
