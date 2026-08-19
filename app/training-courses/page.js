import Image from "next/image";
import Link from "next/link";
import { books } from "./books";

export const metadata = {
  title: "Training Courses | Curtis Riggleman",
  description: "Explore Curtis Riggleman's sales and leadership training books."
};

export default function TrainingCoursesPage() {
  return (
    <main className="training-page">
      <header className="training-header">
        <Link className="home-button" href="/#top" aria-label="Back to home">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10.8 9-7.3 9 7.3v9.2a1 1 0 0 1-1 1h-5.2v-6.4H9.2V21H4a1 1 0 0 1-1-1v-9.2Z" /></svg>
        </Link>
        <Link href="/#top" aria-label="Back to homepage">
          <Image src="/assets/logo-curtis-transparent.png" alt="Official Curtis Riggleman" width={1024} height={1024} className="training-logo" priority />
        </Link>
      </header>

      <section className="training-intro">
        <p className="kicker">The Curtis Riggleman Library</p>
        <h1>Training That <span>Moves The Needle</span></h1>
        <p>Practical sales and leadership systems built from years of real-world dealership experience. Choose a book and start building a stronger team.</p>
      </section>

      <section className="book-grid" aria-label="Curtis Riggleman books">
        {books.map((book) => (
          <article className="book-card" key={book.slug}>
            <div className="book-cover-wrap"><Image src={book.image} alt={`${book.title} book cover`} width={1390} height={2218} className="book-cover" /></div>
            <div className="book-card-content">
              <p className="book-number">BOOK {String(books.indexOf(book) + 1).padStart(2, "0")}</p>
              <h2>{book.title}</h2>
              <p>{book.description}</p>
              <Link className="btn btn-gold" href={`/training-courses/${book.slug}`}>Learn More <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </section>

      <footer className="footer training-footer">Official Curtis Riggleman · Built by AWEVO Software Solutions</footer>
    </main>
  );
}
