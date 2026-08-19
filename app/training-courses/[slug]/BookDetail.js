"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const videoId = "4gLWpkYZCRo";

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
        <Link className="home-button" href="/training-courses" aria-label="Back to training courses"><span aria-hidden="true">←</span></Link>
        <Link href="/#top" aria-label="Homepage"><Image src="/assets/logo-curtis-primary-hd.png" alt="Official Curtis Riggleman" width={2400} height={1061} className="training-logo" priority /></Link>
      </header>
      <section className="detail-hero">
        <p className="kicker">Curtis Riggleman Training</p>
        <h1>{book.title}</h1>
        <p className="detail-lede">Watch Curtis break down the ideas behind this book, then request your copy to be shipped directly to you.</p>
        <div className="detail-video"><iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&playsinline=1`} title={`Curtis Riggleman explains ${book.title}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
      </section>
      <section className="detail-book-summary">
        <div className="detail-cover-wrap"><Image src={book.image} alt={`${book.title} book cover`} width={1390} height={2218} className="detail-cover" /></div>
        <div><p className="kicker">Inside the book</p><h2>Built for the real world.</h2><p>{book.description}</p><button className="btn btn-gold" type="button" onClick={() => setIsFormOpen(true)}>Request Your Copy <span aria-hidden="true">→</span></button></div>
      </section>
      {isFormOpen && <div className="book-modal" role="dialog" aria-modal="true" aria-labelledby="shipping-title"><button className="book-modal-backdrop" aria-label="Close shipping form" onClick={() => setIsFormOpen(false)} /><div className="book-modal-panel"><button className="book-modal-close" type="button" onClick={() => setIsFormOpen(false)} aria-label="Close">×</button><p className="kicker">Get your copy</p><h2 id="shipping-title">Where should we ship your book?</h2><p>Leave your details below and we’ll get your copy headed your way.</p><div className="placeholder-shell"><div className="placeholder-fields"><div>First Name</div><div>Last Name</div><div>Email Address</div><div>Shipping Address</div></div><button className="btn btn-gold" type="button">Continue to shipping</button></div><small>Shipping form integration coming soon.</small></div></div>}
    </main>
  );
}
