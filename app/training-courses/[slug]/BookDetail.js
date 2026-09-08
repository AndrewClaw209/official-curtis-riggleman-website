"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ghlBookCopyFormUrl =
  process.env.NEXT_PUBLIC_GHL_BOOK_COPY_FORM_URL ||
  "https://links.officialcurtisriggleman.com/widget/form/qDKQQCmyeZeRh37DxKXq";

export default function BookDetail({ book }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsFormOpen(true), 20000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("book-modal-open", isFormOpen);
    return () => document.body.classList.remove("book-modal-open");
  }, [isFormOpen]);

  return (
    <main className="book-detail-page">
      <header className="detail-header">
        <Link className="home-button" href="/#top" aria-label="Back to home">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" /></svg>
        </Link>
      </header>
      <section className="detail-hero">
        <p className="kicker">Curtis Riggleman Training</p>
        <h1>{book.title}</h1>
        <p className="detail-lede">Watch Curtis break down the ideas behind this book, then request your copy to be shipped directly to you.</p>
        <div className="detail-video"><video controls autoPlay playsInline preload="auto" title={`Curtis Riggleman explains ${book.title}`}><source src={book.videoSrc} type="video/mp4" />Your browser does not support the video tag.</video></div>
      </section>
      <section className="detail-book-summary">
        <div className="detail-cover-wrap"><Image src={book.image} alt={`${book.title} book cover`} width={1390} height={2218} className="detail-cover" /></div>
        <div><p className="kicker">Inside the book</p><h2>Built for the real world.</h2><p>{book.description}</p><button className="btn btn-gold" type="button" onClick={() => setIsFormOpen(true)}>Request Your Copy <span aria-hidden="true">→</span></button></div>
      </section>
      {isFormOpen && <div className="book-modal" role="dialog" aria-modal="true" aria-labelledby="shipping-title"><button className="book-modal-backdrop" aria-label="Close shipping form" onClick={() => setIsFormOpen(false)} /><div className="book-modal-panel"><button className="book-modal-close" type="button" onClick={() => setIsFormOpen(false)} aria-label="Close">×</button><p className="kicker">Get your copy</p><h2 id="shipping-title">Where should we ship your book?</h2><p>Request a copy of <strong>{book.title}</strong> and leave your shipping details below.</p><iframe className="book-copy-form" src={ghlBookCopyFormUrl} title={`Request a copy of ${book.title}`} loading="lazy" style={{ height: "1127px" }} /></div></div>}
    </main>
  );
}
