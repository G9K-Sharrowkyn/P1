import React, { useState } from "react";
import FontSelector from "./FontSelector.js";

export default function ChatForm({ addMessage }) {
  const [fonts, setFonts] = useState("");
  const inputRef = React.useRef();

  const handleSubmit = (bla) => {
    bla.preventDefault();
    if (inputRef.current.value === '') {
      alert ("Nie wpisano wiadomości.");

      return;
    }

    addMessage(inputRef.current.value);
    inputRef.current.value = '';
  };

  const handleFontChange = (selectedFont) => {
    setFonts([selectedFont]);
  };

  return (
    <div className="chatForm">
      <FontSelector onSelectFont={handleFontChange} />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="chatFormInput"
          style={{ fontFamily: fonts[0] }}
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

/*
Import modułów

Deklaracja komponentu ChatForm, któzy przyjmuje jako argument właściwość 'addMessage'.
Inicjujemy stan komponentu, inputValue przechowuje aktualną wartość wprowadzoną do pola tekstowego, fonts przechowuje czcionki

Funkcja obsługuje przesłanie formularza. 
bla.preventDefault() zapobiega domyślnemu przesyłaniu formularza, czyli odświeżenia strony
Wywołuje funkcję addMessage, przekazywaną jako wartość, z aktualną wartością inputValue a następnie czyści inputValue

Funkcja jest wywoływana gdy użytkownik wybierze czcionkę za pomocą komponentu FontSelector. Aktualizuje stan fonts aby przechowywać wybraną czcionkę.

FontSelector to komponent, używany w komponencie chatForm do wyboru czcionki.
onSelectFont to nazwa właściwości, która jest przekazywana do komponentu FontSelector.
handleFontChange to wartość przypisana do właściwości onSelectFont

<form> to element formuarza html. W komponencie ChatForm używany do utworzenia formularza, który pozwala wprowadzać wiadomości.
onSubmit={handleSubmit} atrybut onSubmit jest elementem formularza, ustawiony na funkcję handleSubmit, definiuje co się stanie gdy zostanie przesłany
*/
