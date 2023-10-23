import React from "react";
import ContactFormForm from "../Registration-ContactForm/ContactFormForm";
import "../../assets/ContactForm.css";
import "../../assets/Chat.css";

export default function ChatMain() {
  const addEntry = (entry) => {
  };

  return (
    <div className="contactFormMain">
      <h6>Formularz Kontaktowy</h6>
      <ContactFormForm addEntry={addEntry} />
    </div>
  );
}
