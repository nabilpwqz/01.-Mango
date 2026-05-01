"use client";

import { useMemo, useState } from "react";
import BookCard from "@/components/BookCard";
import { books } from "@/data/books";

const categories = ["All", "Story", "Tech", "Science"];

export default function BooksView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredBooks = useMemo(() => {
    const list = books
      .filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) &&
          (category === "All" ? true : book.category === category)
      )
      .sort((a, b) => {
        if (sortBy === "newest") return Number(b.id) - Number(a.id);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return b.available_quantity - a.available_quantity;
      });
    return list;
  }, [search, category, sortBy]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return books.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
  }, [search]);

  const onKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      setSearch(suggestions[activeIndex].title);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="container-pro py-8 md:py-10">
      <div className="relative mb-6">
        <input
          type="text"
          className="input-pro h-12"
          placeholder="Search books by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full bg-white border border-[#e5e7eb] rounded-xl p-2 shadow-lg">
            {suggestions.map((item, idx) => (
              <button
                key={item.id}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  idx === activeIndex ? "bg-[#ecfdf5] text-[#065f46]" : "hover:bg-[#f9fafb]"
                }`}
                onClick={() => setSearch(item.title)}
              >
                <span className="font-medium">{item.title}</span>
                <span className="ml-2 muted">by {item.author}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="surface p-4 md:p-5 mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              className={`h-8 px-4 rounded-full text-sm border transition ${
                category === item
                  ? "bg-[#059669] text-white border-[#059669]"
                  : "bg-white text-[#334155] border-[#e5e7eb] hover:border-[#cbd5e1]"
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="w-full md:w-44">
          <select className="input-pro h-10" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} showCategory />
        ))}
        {filteredBooks.length === 0 && (
          <div className="col-span-full surface p-8 text-center text-[#6b7280]">
            No books match your search and filter.
          </div>
        )}
      </section>
    </div>
  );
}
