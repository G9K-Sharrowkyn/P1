import React from "react";
import ContactFormForm from "../Registration-ContactForm/ContactFormForm";
import "../../assets/css/ContactForm.css";
import "../../assets/css/Chat.css";

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
