import { notFound } from "next/navigation";
import { getBook, books } from "../books";
import BookDetail from "./BookDetail";

export function generateStaticParams() {
  return books.map(({ slug }) => ({ slug }));
}

export default async function BookPage({ params }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  return <BookDetail book={book} />;
}
