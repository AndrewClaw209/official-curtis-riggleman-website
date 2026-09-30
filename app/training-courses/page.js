import Image from "next/image";
import Link from "next/link";
import { books } from "./books";
import BookCart from "../../components/BookCart";
import PurchaseStatus from "../../components/PurchaseStatus";

export const metadata = {
  title: "Training Courses",
  description: "Explore Curtis Riggleman's practical sales, closing, leadership, objection-handling, and dealership training books.",
  alternates: { canonical: "/training-courses" },
  openGraph: {
    title: "Sales Training Books | Curtis Riggleman",
    description: "Practical sales and leadership books built from real dealership experience.",
    url: "/training-courses"
  }
};

export default function TrainingCoursesPage() {
  return (
    <main id="main-content" className="training-page">
      <section className="training-intro">
        <p className="kicker">The Curtis Riggleman Library</p>
        <h1>Training That <span>Moves The Needle</span></h1>
        <p>Practical sales and leadership systems built from years of real-world dealership experience. Choose a book and start building a stronger team.</p>
      </section>

      <PurchaseStatus />

      <section className="book-grid" aria-label="Curtis Riggleman books">
        {books.map((book) => (
          <article className="book-card" key={book.slug}>
            <div className="book-card-content">
              <h2>{book.title}</h2>
              <p>{book.description}</p>
              <div className="book-card-actions">
                <Link className="btn btn-gold" href={`/training-courses/${book.slug}`}>Learn More <span aria-hidden="true">→</span></Link>
                <BookCart book={book} />
              </div>
            </div>
            <Link className="book-cover-link" href={`/training-courses/${book.slug}`} aria-label={`Learn more about ${book.title}`}>
              <div className="book-cover-wrap"><Image src={book.image} alt={`${book.title} book cover`} width={1390} height={2218} className="book-cover" /></div>
            </Link>
          </article>
        ))}
      </section>

    </main>
  );
}
