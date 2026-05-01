import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import BorrowButton from "@/components/BorrowButton";
import BookDetailsTabs from "@/components/BookDetailsTabs";
import { books } from "@/data/books";
import { getServerSession } from "@/lib/session";

export default async function BookDetailsPage({ params }) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  const book = books.find((item) => item.id === params.id);
  if (!book) {
    notFound();
  }
  const similarBooks = books.filter((item) => item.category === book.category && item.id !== book.id).slice(0, 3);

  return (
    <div className="container-pro py-10">
      <section className="relative overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl scale-110"
          style={{ backgroundImage: `url(${book.image_url})` }}
        />
        <div className="relative grid lg:grid-cols-12 gap-8 p-6 md:p-10">
          <div className="lg:col-span-5">
            <div className="relative h-[480px] rounded-2xl overflow-hidden border border-white/70 shadow-[0_20px_36px_rgba(15,23,42,0.15)]">
              <Image src={book.image_url} alt={book.title} fill className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.2em] text-[#f59e0b]">{book.category}</p>
            <h1 className="text-4xl font-semibold mt-3">{book.title}</h1>
            <p className="mt-3 text-xl text-[#64748b]">{book.author}</p>
            <p className="mt-3">⭐ 4.8 (219 reviews)</p>
            <p className="mt-5 text-[#475569] leading-7">{book.description}</p>
            <span
              className={`inline-flex mt-5 px-3 py-1 rounded-full text-sm border ${
                book.available_quantity > 0 ? "text-[#047857] border-[#a7f3d0] bg-[#ecfdf5]" : "text-red-600 border-red-200 bg-red-50"
              }`}
            >
              {book.available_quantity} copies left
            </span>
            <div className="mt-6 max-w-xs">
              <BorrowButton disabled={book.available_quantity < 1} />
            </div>
          </div>
        </div>
      </section>
      <BookDetailsTabs book={book} similarBooks={similarBooks} />
    </div>
  );
}