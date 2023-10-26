import React, { useRef } from "react";

export default function ContactFormForm({ sendMessage }) {
  const nameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const problemRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const problem = problemRef.current.value;

    sendMessage({
      name,
      lastName,
      email,
      phone,
      problem,
    });

    nameRef.current.value = '';
    lastNameRef.current.value = '';
    emailRef.current.value = '';
    phoneRef.current.value = '';
    problemRef.current.value = '';
  };

  return (
    <div className="chatFormForm">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contactName">Imię:</label>
          <input
            ref={nameRef}
            type="text"
            className="contactFormInput"
            id="name"
            placeholder="Wpisz imię..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactLastName">Nazwisko:</label>
          <input
            ref={lastNameRef}
            type="text"
            className="contactFormInput"
            id="lastName"
            placeholder="Wpisz nazwisko..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactEmail">Email:</label>
          <input
            ref={emailRef}
            type="text"
            className="contactFormInput"
            id="email"
            placeholder="Wpisz email..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactPhone">Numer telefonu:</label>
          <input
            ref={phoneRef}
            type="text"
            className="contactFormInput"
            id="phone"
            placeholder="Wpisz numer telefonu..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactProblem">Opisz problem:</label>
          <textarea
            ref={problemRef}
            className="contactFormInput2"
            id="problem"
            placeholder="Opisz problem..."
          ></textarea>
        </div>
        <button type="submit" className="contactFormSubmit">
          Wyślij formularz
        </button>
      </form>
      <div className="clearf9x" />
    </div>
  );
}
