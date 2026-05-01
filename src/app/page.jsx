import Link from "next/link";
import BookCard from "@/components/BookCard";
import TestimonialSlider from "@/components/TestimonialSlider";
import { books } from "@/data/books";

export default function HomePage() {
  const featuredBooks = books.slice(0, 8);
  const trendingBooks = books.slice(0, 6);
  return (
    <div className="container-pro py-8 md:py-12 space-y-14 fade-in">
      <section className="surface p-6 md:p-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[560px]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#f59e0b]">Online Book Platform</p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#0f172a]">
              Find Your Next Read
            </h1>
            <p className="text-lg text-[#6b7280] max-w-xl">
              Discover curated stories, tech books, and science classics in a premium borrowing experience designed for modern readers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/books" className="btn-pro btn-pro-primary">
                Browse Collection
              </Link>
              <Link href="/register" className="btn-pro btn-pro-ghost">
                Become a Member
              </Link>
            </div>
          </div>
          <div className="relative h-[420px] hidden md:block">
            {trendingBooks.slice(0, 3).map((book, i) => (
              <Link
                href={`/books/${book.id}`}
                key={book.id}
                className="absolute top-8 w-44 h-64 rounded-2xl overflow-hidden border border-white/70 shadow-[0_22px_38px_rgba(15,23,42,0.16)] transition-transform duration-300 hover:-translate-y-2"
                style={{ left: `${i * 120}px`, transform: `rotate(${i === 0 ? -8 : i === 1 ? -1 : 7}deg)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Trending Now</h2>
          <Link href="/books" className="text-sm font-medium text-[#059669]">View all</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-3">
          {trendingBooks.map((book) => (
            <Link href={`/books/${book.id}`} key={book.id} className="min-w-[180px] surface p-3 rounded-2xl hover:-translate-y-1 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={book.image_url} alt={book.title} className="h-56 w-full rounded-xl object-cover" loading="lazy" />
              <p className="mt-3 text-sm font-medium line-clamp-2">{book.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Story", "Tech", "Science", "New Arrivals"].map((item) => (
          <Link href="/books" key={item} className="surface p-5 text-center hover:-translate-y-1 transition">
            <div className="text-2xl mb-2">{item === "Story" ? "📖" : item === "Tech" ? "💻" : item === "Science" ? "🧪" : "✨"}</div>
            <p className="font-medium">{item}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-5">Featured Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="surface p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#f59e0b]">Monthly Editor Pick</p>
          <h3 className="text-3xl font-semibold mt-3">{books[0].title}</h3>
          <p className="mt-2 text-[#6b7280]">{books[0].description}</p>
          <Link className="btn-pro btn-pro-primary mt-5" href={`/books/${books[0].id}`}>Read Details</Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="surface p-4">
            <p className="text-sm muted">Books</p>
            <p className="text-2xl font-semibold">1.2k+</p>
          </div>
          <div className="surface p-4">
            <p className="text-sm muted">Readers</p>
            <p className="text-2xl font-semibold">750+</p>
          </div>
          <div className="surface p-4">
            <p className="text-sm muted">Rating</p>
            <p className="text-2xl font-semibold">4.9</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Member Reviews</h2>
        <TestimonialSlider />
      </section>
    </div>
  );
}
