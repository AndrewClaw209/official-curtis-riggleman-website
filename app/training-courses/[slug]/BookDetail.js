"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BookCart from "../../../components/BookCart";
import { books } from "../books";

const ghlBookCopyFormUrl =
  process.env.NEXT_PUBLIC_GHL_BOOK_COPY_FORM_URL ||
  "https://links.officialcurtisriggleman.com/widget/form/qDKQQCmyeZeRh37DxKXq";

export default function BookDetail({ book }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const carouselRef = useRef(null);

  const scrollBooks = (direction) => {
    carouselRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

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
      <section className="detail-hero">
        <p className="kicker">Curtis Riggleman Training</p>
        <h1>{book.title}</h1>
        <p className="detail-lede">Watch Curtis break down the ideas behind this book, then request your copy to be shipped directly to you.</p>
        <div className="detail-video"><video controls autoPlay muted playsInline preload="auto" title={`Curtis Riggleman explains ${book.title}`}><source src={book.videoSrc} type="video/mp4" />Your browser does not support the video tag.</video></div>
      </section>
      <section className="detail-book-summary">
        <div className="detail-cover-wrap"><Image src={book.image} alt={`${book.title} book cover`} width={1390} height={2218} className="detail-cover" /></div>
        <div><p className="kicker">Inside the book</p><h2>Built for the real world.</h2><p>{book.description}</p><div className="detail-book-actions"><button className="btn btn-gold" type="button" onClick={() => setIsFormOpen(true)}>Request Your Copy <span aria-hidden="true">→</span></button><BookCart book={book} /></div></div>
      </section>
      <section className="book-carousel" aria-labelledby="book-carousel-title">
        <div className="book-carousel-heading">
          <div><p className="kicker">Keep building your edge</p><h2 id="book-carousel-title">Explore every training book</h2></div>
          <div className="book-carousel-controls" aria-label="Browse training books">
            <button type="button" onClick={() => scrollBooks(-1)} aria-label="Show previous books">←</button>
            <button type="button" onClick={() => scrollBooks(1)} aria-label="Show next books">→</button>
          </div>
        </div>
        <div className="book-carousel-track" ref={carouselRef} tabIndex="0">
          {books.map((item) => <Link className={`book-carousel-card${item.slug === book.slug ? " is-current" : ""}`} href={`/training-courses/${item.slug}`} key={item.slug} aria-label={`Open ${item.title}`}>
            <div className="book-carousel-cover"><Image src={item.image} alt="" width={1390} height={2218} /></div>
            <div><p className="kicker">{item.slug === book.slug ? "You are here" : "Training book"}</p><h3>{item.title}</h3><span>View book <span aria-hidden="true">→</span></span></div>
          </Link>)}
        </div>
      </section>
      {isFormOpen && <div className="book-modal" role="dialog" aria-modal="true" aria-labelledby="shipping-title"><button className="book-modal-backdrop" aria-label="Close shipping form" onClick={() => setIsFormOpen(false)} /><div className="book-modal-panel"><button className="book-modal-close" type="button" onClick={() => setIsFormOpen(false)} aria-label="Close">×</button><p className="kicker">Get your copy</p><h2 id="shipping-title">Where should we ship your book?</h2><p>Request a copy of <strong>{book.title}</strong> and leave your shipping details below.</p><iframe className="book-copy-form" src={ghlBookCopyFormUrl} title={`Request a copy of ${book.title}`} loading="lazy" style={{ height: "1127px" }} /></div></div>}
    </main>
  );
}
