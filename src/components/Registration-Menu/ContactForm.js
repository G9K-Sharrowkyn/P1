import React from "react";
import ContactFormForm from "../Registration-ContactForm/ContactFormForm";
import "../../assets/css/ContactForm.css";
import "../../assets/css/Chat.css";

export default function ChatMain() {

  function openMailApplication() {
    const newWindow = window.open("mailto:email@example.com")
    newWindow.close();
  }

  return (
    <div className="contactFormMain">
      <h6>Formularz Kontaktowy</h6>
      <ContactFormForm sendMessage={openMailApplication} />
    </div>
  );
}
