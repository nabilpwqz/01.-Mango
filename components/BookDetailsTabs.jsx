"use client";

import { useState } from "react";
import Link from "next/link";

export default function BookDetailsTabs({ book, similarBooks }) {
  const [tab, setTab] = useState("overview");

  return (
    <section className="surface p-6 md:p-8 mt-8">
      <div className="flex gap-6 border-b border-[#e5e7eb] mb-5">
        {["overview", "reviews", "similar"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`pb-3 text-sm font-medium border-b-2 capitalize ${
              tab === item ? "border-[#059669] text-[#0f172a]" : "border-transparent text-[#6b7280]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "overview" && <p className="text-[#475569] leading-7">{book.description}</p>}
      {tab === "reviews" && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-[#e5e7eb]">
            <p className="font-medium">Ayesha</p>
            <p className="text-sm text-[#6b7280] mt-1">Excellent read and easy to borrow. Great platform flow.</p>
          </div>
          <div className="p-4 rounded-xl border border-[#e5e7eb]">
            <p className="font-medium">Nabil</p>
            <p className="text-sm text-[#6b7280] mt-1">Loved the details page and recommendation section.</p>
          </div>
        </div>
      )}
      {tab === "similar" && (
        <div className="grid md:grid-cols-3 gap-4">
          {similarBooks.map((item) => (
            <Link key={item.id} href={`/books/${item.id}`} className="p-4 rounded-xl border border-[#e5e7eb] hover:border-[#059669] transition">
              <p className="font-medium line-clamp-2">{item.title}</p>
              <p className="text-sm text-[#6b7280] mt-1">{item.author}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
