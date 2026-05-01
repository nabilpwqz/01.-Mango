import Link from "next/link";

export default function BookCard({ book, showCategory = false }) {
  return (
    <article className="card-pro overflow-hidden group">
      <div className="relative h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.image_url}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Link href={`/books/${book.id}`} className="btn-pro h-9 text-sm bg-white/95 text-[#0f172a] px-3 rounded-lg">
            Preview
          </Link>
          <Link href={`/books/${book.id}`} className="btn-pro h-9 text-sm bg-[#059669] text-white px-3 rounded-lg">
            Borrow
          </Link>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-[17px] font-semibold leading-snug line-clamp-2 min-h-[46px]">{book.title}</h3>
        <p className="text-sm muted">By {book.author}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm">⭐ 4.8</span>
          <span
            className={`text-xs px-2 py-1 rounded-full border ${
              book.available_quantity > 0 ? "text-[#059669] border-[#a7f3d0]" : "text-red-600 border-red-200"
            }`}
          >
            {book.available_quantity > 0 ? `${book.available_quantity} available` : "Unavailable"}
          </span>
        </div>
        {showCategory && <p className="text-xs uppercase tracking-wide muted">{book.category}</p>}
      </div>
    </article>
  );
}
