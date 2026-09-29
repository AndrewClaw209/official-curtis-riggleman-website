"use client";

import { useState } from "react";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: ""
};

export default function ContactForm() {
  const [formValues, setFormValues] = useState(initialFormState);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "sending") {
      return;
    }

    setStatus("sending");
    setStatusMessage("");

    const payload = new FormData();
    payload.append("_subject", "New website lead form submission");
    payload.append("_honey", "");
    payload.append("name", formValues.name);
    payload.append("email", formValues.email);
    payload.append("phone", formValues.phone);
    payload.append("company", formValues.company);
    payload.append("message", formValues.message);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/info@officialcurtisriggleman.com",
        {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: payload
        }
      );

      if (!response.ok) {
        throw new Error("Unable to send message.");
      }

      const result = await response.json();

      if (result.success !== "true") {
        throw new Error("Unable to send message.");
      }

      setStatus("success");
      setStatusMessage("Message sent. Curtis' team will reply shortly.");
      setFormValues(initialFormState);
    } catch {
      setStatus("error");
      setStatusMessage(
        "Message could not be sent right now. Please email info@officialcurtisriggleman.com."
      );
    }
  };

  return (
    <>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">
          Full Name
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            value={formValues.name}
            onChange={handleChange}
            required
            disabled={status === "sending"}
          />
        </label>
        <label htmlFor="contact-email">
          Email Address
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            value={formValues.email}
            onChange={handleChange}
            required
            disabled={status === "sending"}
          />
        </label>
        <label htmlFor="contact-phone">
          Phone Number
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={formValues.phone}
            onChange={handleChange}
            disabled={status === "sending"}
          />
        </label>
        <label htmlFor="contact-company">
          Dealership / Company
          <input
            id="contact-company"
            type="text"
            name="company"
            autoComplete="organization"
            value={formValues.company}
            onChange={handleChange}
            disabled={status === "sending"}
          />
        </label>
        <label className="contact-form-wide" htmlFor="contact-message">
          Message
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={formValues.message}
            onChange={handleChange}
            required
            disabled={status === "sending"}
            placeholder="Tell us what kind of coaching support you are looking for."
          />
        </label>
        <button
          className="btn btn-gold btn-priority contact-submit"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status === "success" ? (
        <p className="contact-form-status contact-form-status-success" role="status">
          {statusMessage}
        </p>
      ) : null}

      {status === "error" ? (
        <p className="contact-form-status contact-form-status-error" role="alert">
          {statusMessage}
        </p>
      ) : null}
    </>
  );
}
