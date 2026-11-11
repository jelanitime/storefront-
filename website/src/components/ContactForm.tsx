"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import { btn, input, label } from "./ui";

/** Contact form on the Help page (shows a confirmation; no email is sent yet). */
export function ContactForm() {
  const [error, setError] = useState("");
  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const email = String(d.get("email") ?? "");
        const msg = String(d.get("message") ?? "").trim();
        if (!/^\S+@\S+\.\S+$/.test(email) || msg.length < 5) {
          setError("Please add a valid email and a short message.");
          return;
        }
        setError("");
        e.currentTarget.reset();
        toast("Thanks! We'll reply within 24 hours.");
      }}
    >
      <div>
        <label htmlFor="c-email" className={label}>Your email</label>
        <input id="c-email" name="email" type="email" autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="c-topic" className={label}>Topic</label>
        <select id="c-topic" name="topic" className={input}>
          <option>An order I placed</option>
          <option>Selling an item</option>
          <option>Returns & refunds</option>
          <option>Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="c-msg" className={label}>Message</label>
        <textarea id="c-msg" name="message" rows={4} className={`${input} h-auto py-2`} />
      </div>
      {error && <p role="alert" className="text-sm text-sale">{error}</p>}
      <button type="submit" className={`${btn.primary} w-fit`}>Send message</button>
    </form>
  );
}
