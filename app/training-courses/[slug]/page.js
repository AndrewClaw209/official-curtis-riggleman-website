import { notFound } from "next/navigation";
import { getBook, books } from "../books";
import BookDetail from "./BookDetail";

export function generateStaticParams() {
  return books.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};

  return {
    title: `${book.title} | Sales Training Book`,
    description: book.description,
    alternates: { canonical: `/training-courses/${book.slug}` },
    openGraph: {
      type: "book",
      title: `${book.title} | Curtis Riggleman`,
      description: book.description,
      url: `/training-courses/${book.slug}`,
      images: [{ url: book.image, alt: `${book.title} book cover` }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} | Curtis Riggleman`,
      description: book.description,
      images: [book.image]
    }
  };
}

export default async function BookPage({ params }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  return <BookDetail book={book} />;
}
