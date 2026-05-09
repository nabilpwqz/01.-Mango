"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  available_quantity: number;
  image_url: string;
};

type UserStored = {
  id: number;
  name: string;
  email: string;
  password: string;
  photo_url: string;
  provider: string;
};

type UserSession = Omit<UserStored, "password">;

const defaultBooks: Book[] = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library...",
    category: "Story",
    available_quantity: 5,
    image_url: "https://picsum.photos/seed/book1/400/560",
  },
  {
    id: 2,
    title: "The Lost Garden",
    author: "Sarah Addison",
    description: "A enchanting tale...",
    category: "Story",
    available_quantity: 3,
    image_url: "https://picsum.photos/seed/book2/400/560",
  },
  {
    id: 3,
    title: "Ocean's Whisper",
    author: "Maria Chen",
    description: "A coastal village...",
    category: "Story",
    available_quantity: 7,
    image_url: "https://picsum.photos/seed/book3/400/560",
  },
  {
    id: 4,
    title: "The Storyteller's Secret",
    author: "James Wright",
    description: "An old storyteller...",
    category: "Story",
    available_quantity: 4,
    image_url: "https://picsum.photos/seed/book4/400/560",
  },
  {
    id: 5,
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile...",
    category: "Tech",
    available_quantity: 8,
    image_url: "https://picsum.photos/seed/book5/400/560",
  },
  {
    id: 6,
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    description: "The classic guide...",
    category: "Tech",
    available_quantity: 6,
    image_url: "https://picsum.photos/seed/book6/400/560",
  },
  {
    id: 7,
    title: "AI Revolution",
    author: "Stuart Russell",
    description: "An insightful exploration...",
    category: "Tech",
    available_quantity: 9,
    image_url: "https://picsum.photos/seed/book7/400/560",
  },
  {
    id: 8,
    title: "Cloud Architecture Patterns",
    author: "Bill Wilder",
    description: "A comprehensive guide...",
    category: "Tech",
    available_quantity: 4,
    image_url: "https://picsum.photos/seed/book8/400/560",
  },
  {
    id: 9,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description: "From the Big Bang...",
    category: "Science",
    available_quantity: 10,
    image_url: "https://picsum.photos/seed/book9/400/560",
  },
  {
    id: 10,
    title: "The Gene",
    author: "Siddhartha Mukherjee",
    description: "A magnificent history...",
    category: "Science",
    available_quantity: 5,
    image_url: "https://picsum.photos/seed/book10/400/560",
  },
  {
    id: 11,
    title: "Cosmos",
    author: "Carl Sagan",
    description: "A legendary journey...",
    category: "Science",
    available_quantity: 7,
    image_url: "https://picsum.photos/seed/book11/400/560",
  },
  {
    id: 12,
    title: "The Hidden Life of Trees",
    author: "Peter Wohlleben",
    description: "Discover the astonishing...",
    category: "Science",
    available_quantity: 6,
    image_url: "https://picsum.photos/seed/book12/400/560",
  },
];

function getCurrentRoute(): string {
  const h = typeof window !== "undefined" ? window.location.hash || "#/" : "#/";
  const base = h.split("?")[0].replace(/\/$/, "");
  return base === "#" ? "#/" : base;
}

function getBooks(): Book[] {
  const s = localStorage.getItem("mango_books");
  if (s) return JSON.parse(s) as Book[];
  localStorage.setItem("mango_books", JSON.stringify(defaultBooks));
  return [...defaultBooks];
}

function saveBooks(b: Book[]): void {
  localStorage.setItem("mango_books", JSON.stringify(b));
}

function getUsers(): UserStored[] {
  const s = localStorage.getItem("mango_users");
  if (s) return JSON.parse(s) as UserStored[];
  const u: UserStored[] = [
    {
      id: 1,
      name: "Demo User",
      email: "demo@mango.com",
      password: "password123",
      photo_url: "https://picsum.photos/seed/user1/200/200",
      provider: "email",
    },
  ];
  localStorage.setItem("mango_users", JSON.stringify(u));
  return u;
}

function saveUsers(u: UserStored[]): void {
  localStorage.setItem("mango_users", JSON.stringify(u));
}

function getCurrentUserLs(): UserSession | null {
  const s = localStorage.getItem("mango_current_user");
  return s ? (JSON.parse(s) as UserSession) : null;
}

function setCurrentUserLs(u: UserSession | null): void {
  u
    ? localStorage.setItem("mango_current_user", JSON.stringify(u))
    : localStorage.removeItem("mango_current_user");
}

function navigateTo(hash: string): void {
  window.location.hash = hash;
}

function getSortedBooks(books: Book[], sort: string): Book[] {
  const c = [...books];
  if (sort === "newest") return c.sort((a, b) => b.id - a.id);
  if (sort === "popular")
    return c.sort((a, b) => a.available_quantity - b.available_quantity);
  return c;
}

type ToastType = "success" | "error" | "warning";

type ToastItem = { id: number; msg: string; type: ToastType };

const MARQUEE_TEXT = (() => {
  const nbsp = "\u00a0";
  return `🆕 New Arrivals: "The Midnight Library" | "Clean Code" | "Cosmos" | "The Gene" ${nbsp}|${nbsp} 🎉 Special Discount on Memberships — Get 30% off annual plans ${nbsp}|${nbsp} 📚 This Week's Highlight: "AI Revolution" by Stuart Russell ${nbsp}|${nbsp} ⭐ Reader's Choice: "The Pragmatic Programmer" ${nbsp}|${nbsp} 🆕 New Arrivals: "The Midnight Library" | "Clean Code" | "Cosmos" | "The Gene" ${nbsp}|${nbsp} 🎉 Special Discount on Memberships — Get 30% off annual plans ${nbsp}|${nbsp} 📚 This Week's Highlight: "AI Revolution" by Stuart Russell ${nbsp}|${nbsp} ⭐ Reader's Choice: "The Pragmatic Programmer"`;
})();

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.66-2.26 1.05-3.71 1.05-2.86 0-5.28-1.93-6.15-4.53H2.18v2.84C4 20.73 7.73 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.06A6.53 6.53 0 015.5 12c0-.71.12-1.4.35-2.06V7.1H2.18A10.86 10.86 0 001 12c0 1.77.42 3.44 1.18 4.94l3.67-2.88z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.73 1 4 3.27 2.18 6.56l3.67 2.88C6.72 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default function MangoClient() {
  const [route, setRoute] = useState("#/");
  const [storageReady, setStorageReady] = useState(false);
  const [books, setBooks] = useState<Book[]>(defaultBooks);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState("");
  const [updateName, setUpdateName] = useState("");

  const showToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  useEffect(() => {
    setRoute(getCurrentRoute());
    const onHash = () => setRoute(getCurrentRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    setBooks(getBooks());
    setCurrentUser(getCurrentUserLs());
    setStorageReady(true);
    console.log("🥭 Mango ready.");
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const user = currentUser;
    const r = route;
    if (r.startsWith("#/book/") && !user) {
      showToast("Please log in.", "warning");
      navigateTo("#/login");
      return;
    }
    if (r === "#/profile" && !user) {
      showToast("Please log in.", "warning");
      navigateTo("#/login");
      return;
    }
    if (r === "#/update-profile" && !user) {
      showToast("Please log in.", "warning");
      navigateTo("#/login");
      return;
    }
    if (r === "#/login" && user) {
      navigateTo("#/");
      return;
    }
    if (r === "#/register" && user) {
      navigateTo("#/");
      return;
    }
    setMobileNavOpen(false);
  }, [route, currentUser, storageReady, showToast]);

  useEffect(() => {
    if (!storageReady) return;
    const r = route;
    const valid =
      r === "#/" ||
      r === "#/all-books" ||
      r.startsWith("#/book/") ||
      r === "#/login" ||
      r === "#/register" ||
      r === "#/profile" ||
      r === "#/update-profile";
    if (!valid) navigateTo("#/");
  }, [route, storageReady]);

  const pageId = useMemo(() => {
    if (route.startsWith("#/book/")) return "book-details";
    if (route === "#/") return "home";
    if (route === "#/all-books") return "all-books";
    if (route === "#/login") return "login";
    if (route === "#/register") return "register";
    if (route === "#/profile") return "profile";
    if (route === "#/update-profile") return "update-profile";
    return "unknown";
  }, [route]);

  useEffect(() => {
    if (!storageReady) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageId, storageReady]);

  const bookDetailId = useMemo(() => {
    if (!route.startsWith("#/book/")) return NaN;
    return parseInt(route.split("#/book/")[1], 10);
  }, [route]);

  const activeBook = useMemo(
    () => (Number.isFinite(bookDetailId) ? books.find((x) => x.id === bookDetailId) : undefined),
    [books, bookDetailId],
  );

  const filteredBooks = useMemo(() => {
    let list =
      activeCat === "all"
        ? [...books]
        : books.filter(
            (b) => b.category.toLowerCase() === activeCat.toLowerCase(),
          );
    const q = searchQuery.trim().toLowerCase();
    if (q) list = list.filter((b) => b.title.toLowerCase().includes(q));
    return getSortedBooks(list, sortBy);
  }, [books, activeCat, searchQuery, sortBy]);

  const featuredKey = books
    .slice(0, 4)
    .map((b) => `${b.id}:${b.available_quantity}`)
    .join("|");

  const navHomeActive = pageId === "home" || pageId === "unknown";
  const navBooksActive = pageId === "all-books";
  const navProfileActive = pageId === "profile";

  useEffect(() => {
    if (pageId === "update-profile" && currentUser) {
      setUpdatePhoto(currentUser.photo_url || "");
      setUpdateName(currentUser.name || "");
    }
  }, [pageId, currentUser]);

  const persistBooksAndSet = (next: Book[]) => {
    saveBooks(next);
    setBooks(next);
  };

  const logout = () => {
    setCurrentUserLs(null);
    setCurrentUser(null);
    showToast("Logged out.", "success");
    navigateTo("#/");
  };

  const googleAuth = () => {
    const mock: UserSession = {
      id: Date.now(),
      name: "Google User",
      email: "g" + Date.now() + "@gmail.com",
      photo_url: "https://picsum.photos/seed/google-user/200/200",
      provider: "google",
    };
    const users = getUsers();
    if (!users.find((u) => u.email === mock.email))
      users.push({ ...mock, password: "oauth" });
    saveUsers(users);
    setCurrentUserLs(mock);
    setCurrentUser(mock);
    showToast("Google login successful!", "success");
    navigateTo("#/");
  };

  const onBorrow = () => {
    if (!currentUser) {
      showToast("Please log in.", "warning");
      navigateTo("#/login");
      return;
    }
    const booksCopy = [...getBooks()];
    const t = booksCopy.find((x) => x.id === bookDetailId);
    if (t && t.available_quantity > 0) {
      t.available_quantity--;
      persistBooksAndSet(booksCopy);
      showToast(`Borrowed "${t.title}"!`, "success");
    } else showToast("No longer available.", "error");
  };

  const sectionActive = (
    page:
      | "home"
      | "all-books"
      | "book-details"
      | "login"
      | "register"
      | "profile"
      | "update-profile",
  ) =>
    pageId === page || (page === "home" && pageId === "unknown")
      ? "page-section active"
      : "page-section";

  return (
    <>
      <div id="toast-container">
        {toasts.map((t) => {
          const bg =
            t.type === "error"
              ? "bg-red-600"
              : t.type === "warning"
                ? "bg-amber-500"
                : "bg-green-600";
          const icon =
            t.type === "error" ? "❌" : t.type === "warning" ? "⚠️" : "✅";
          return (
            <div
              key={t.id}
              className={`toast-item ${bg} text-white px-5 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2`}
            >
              <span>{icon}</span> {t.msg}
            </div>
          );
        })}
      </div>

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-warm-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <a
              href="#/"
              className="flex items-center gap-2 font-display text-2xl lg:text-3xl font-bold text-mango-700 hover:text-mango-600 transition-colors"
              id="nav-logo"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("#/");
              }}
            >
              <span className="text-3xl lg:text-4xl">🥭</span>
              <span>Mango</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a
                href="#/"
                className={`nav-link transition-colors py-2 border-b-2 ${
                  navHomeActive
                    ? "border-mango-500 text-mango-600"
                    : "border-transparent text-gray-700 hover:text-mango-600 hover:border-mango-500"
                }`}
              >
                Home
              </a>
              <a
                href="#/all-books"
                className={`nav-link transition-colors py-2 border-b-2 ${
                  navBooksActive
                    ? "border-mango-500 text-mango-600"
                    : "border-transparent text-gray-700 hover:text-mango-600 hover:border-mango-500"
                }`}
              >
                All Books
              </a>
              {currentUser ? (
                <a
                  href="#/profile"
                  className={`nav-link transition-colors py-2 border-b-2 ${
                    navProfileActive
                      ? "border-mango-500 text-mango-600"
                      : "border-transparent text-gray-700 hover:text-mango-600 hover:border-mango-500"
                  }`}
                  id="nav-profile-link"
                >
                  My Profile
                </a>
              ) : null}
            </nav>
            <div className="flex items-center gap-3" id="nav-auth-area">
              {currentUser ? (
                <>
                  <span className="hidden sm:inline text-sm font-semibold text-mango-700 bg-mango-50 px-3 py-1.5 rounded-full">
                    👋 {currentUser.name}
                  </span>
                  <button
                    type="button"
                    id="logout-btn"
                    className="btn btn-sm btn-outline border-red-300 text-red-600 hover:bg-red-50 rounded-full"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="#/login"
                  className="btn btn-sm bg-mango-600 hover:bg-mango-700 text-white border-none rounded-full px-5"
                >
                  Login
                </a>
              )}
            </div>
            <button
              type="button"
              id="mobile-menu-btn"
              className="md:hidden btn btn-ghost btn-circle text-2xl text-gray-700"
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              ☰
            </button>
          </div>
          <div
            id="mobile-nav-dropdown"
            className={`${mobileNavOpen ? "" : "hidden"} md:hidden pb-4 flex flex-col gap-2 border-t border-warm-200 pt-3`}
          >
            <a
              href="#/"
              className="mobile-nav-link btn btn-ghost justify-start text-gray-700"
              onClick={() => setMobileNavOpen(false)}
            >
              🏠 Home
            </a>
            <a
              href="#/all-books"
              className="mobile-nav-link btn btn-ghost justify-start text-gray-700"
              onClick={() => setMobileNavOpen(false)}
            >
              📖 All Books
            </a>
            {currentUser ? (
              <a
                href="#/profile"
                className="mobile-nav-link btn btn-ghost justify-start text-gray-700"
                id="mobile-nav-profile"
                onClick={() => setMobileNavOpen(false)}
              >
                👤 My Profile
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section id="page-home" className={sectionActive("home")}>
          <div className="relative bg-gradient-to-br from-mango-700 via-mango-600 to-mango-500 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-hero-pattern"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
              <div className="max-w-2xl animate__animated animate__fadeInUp">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white drop-shadow-lg">
                  Find Your
                  <br />
                  Next{" "}
                  <span className="text-mango-200 bg-gradient-to-r from-mango-200 to-leaf-200 text-transparent bg-clip-text">
                    Read
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-mango-100 mb-8 max-w-lg">
                  Explore thousands of books, borrow digitally, and dive into
                  worlds of knowledge — all from the comfort of your screen.
                </p>
                <a
                  href="#/all-books"
                  className="btn btn-lg bg-white hover:bg-mango-50 text-mango-700 font-bold border-none px-8 rounded-full text-base shadow-2xl shadow-mango-900/30 transition-all hover:scale-105 btn-hover-effect"
                >
                  Browse Now ✨
                </a>
              </div>
            </div>
            <div className="absolute top-10 right-10 w-28 h-28 bg-mango-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-40 w-40 h-40 bg-leaf-400/15 rounded-full blur-3xl"></div>
          </div>

          <div className="marquee-wrapper">
            <span className="marquee-content text-sm sm:text-base">
              {MARQUEE_TEXT}
            </span>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-mango-700 mb-3">
                Featured Books
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Handpicked selections just for you.
              </p>
            </div>
            <div className="swiper featured-swiper rounded-2xl overflow-hidden relative">
              <Swiper
                key={featuredKey}
                modules={[Autoplay, Navigation, Pagination]}
                slidesPerView={1}
                spaceBetween={20}
                loop
                autoplay={{ delay: 4000 }}
                pagination={{ clickable: true, el: ".featured-pagination" }}
                navigation={{
                  nextEl: ".featured-next",
                  prevEl: ".featured-prev",
                }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                className="!overflow-visible"
              >
                {books.slice(0, 4).map((b) => {
                  const isNew = b.id > 8,
                    isPopular = b.available_quantity <= 4;
                  return (
                    <SwiperSlide key={b.id} className="p-2">
                      <div className="book-card flex flex-col h-full relative">
                        {isNew ? (
                          <span className="badge-new">NEW</span>
                        ) : null}
                        {isPopular ? (
                          <span className="badge-popular">POPULAR</span>
                        ) : null}
                        <div className="h-56 sm:h-64 overflow-hidden relative">
                          <Image
                            src={b.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 25vw"
                            unoptimized
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <span className="text-xs font-semibold text-mango-600 uppercase">
                            {b.category}
                          </span>
                          <h3 className="font-bold text-lg text-mango-700">
                            {b.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            by {b.author}
                          </p>
                          <button
                            type="button"
                            className="btn btn-sm bg-mango-600 text-white rounded-full w-full mt-auto view-details-btn"
                            data-id={b.id}
                            onClick={() => navigateTo(`#/book/${b.id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className="swiper-button-next featured-next" />
              <div className="swiper-button-prev featured-prev" />
              <div className="swiper-pagination featured-pagination !bottom-2" />
            </div>
          </div>

          <div className="bg-white py-16 border-y border-warm-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-mango-700 mb-3">
                How It Works
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
              <div className="text-center p-8 rounded-2xl bg-warm-50 hover:bg-mango-50 transition-all duration-300 border border-warm-100">
                <div className="w-16 h-16 bg-mango-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                  🔍
                </div>
                <h3 className="font-bold text-xl text-mango-700 mb-2">
                  1. Browse & Discover
                </h3>
                <p className="text-gray-600">Find the perfect book by category.</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-warm-50 hover:bg-mango-50 transition-all duration-300 border border-warm-100">
                <div className="w-16 h-16 bg-mango-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                  📋
                </div>
                <h3 className="font-bold text-xl text-mango-700 mb-2">
                  2. Borrow Instantly
                </h3>
                <p className="text-gray-600">Click borrow and start reading.</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-warm-50 hover:bg-mango-50 transition-all duration-300 border border-warm-100">
                <div className="w-16 h-16 bg-mango-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                  📖
                </div>
                <h3 className="font-bold text-xl text-mango-700 mb-2">
                  3. Read & Return
                </h3>
                <p className="text-gray-600">
                  Return when done so others can enjoy.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-gradient-to-r from-mango-700 to-mango-600 rounded-3xl p-8 lg:p-12 text-white text-center shadow-2xl">
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                📚 2026 Reading Challenge
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mt-8">
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-extrabold text-mango-200">
                    12K+
                  </div>
                  <div className="text-sm text-mango-100 mt-1">Active Readers</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-extrabold text-mango-200">45K</div>
                  <div className="text-sm text-mango-100 mt-1">Books Borrowed</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-extrabold text-mango-200">
                    8.7
                  </div>
                  <div className="text-sm text-mango-100 mt-1">Avg. Rating</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-extrabold text-mango-200">
                    24/7
                  </div>
                  <div className="text-sm text-mango-100 mt-1">Availability</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="page-all-books" className={sectionActive("all-books")}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-mango-700 mb-6">
              All Books
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                id="search-books-input"
                placeholder="🔍 Search books by title..."
                className="input input-bordered w-full rounded-full text-base py-6 px-6 border-warm-200 focus:border-mango-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                id="sort-books-select"
                className="select select-bordered rounded-full py-3 px-5 border-warm-200 sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort: Default</option>
                <option value="newest">Sort: Newest</option>
                <option value="popular">Sort: Most Popular</option>
              </select>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-56 flex-shrink-0">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200 sticky top-24">
                  <h3 className="font-bold text-lg text-mango-700 mb-4">
                    Categories
                  </h3>
                  <div
                    className="flex flex-wrap lg:flex-col gap-2"
                    id="category-filter-buttons"
                  >
                    {(
                      [
                        ["all", "📚 All"],
                        ["Story", "📖 Story"],
                        ["Tech", "💻 Tech"],
                        ["Science", "🔬 Science"],
                      ] as const
                    ).map(([cat, label]) => (
                      <button
                        key={cat}
                        type="button"
                        className={`cat-filter-btn btn btn-sm btn-outline rounded-full ${activeCat === cat ? "active-filter" : ""}`}
                        data-cat={cat}
                        onClick={() => setActiveCat(cat)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
              <div className="flex-1">
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  id="all-books-grid"
                >
                  {filteredBooks.map((b) => {
                    const isNew = b.id > 8,
                      isPopular = b.available_quantity <= 4;
                    return (
                      <div
                        key={b.id}
                        className="book-card flex flex-col relative"
                      >
                        {isNew ? <span className="badge-new">NEW</span> : null}
                        {isPopular ? (
                          <span className="badge-popular">POPULAR</span>
                        ) : null}
                        <div className="h-48 sm:h-56 overflow-hidden relative">
                          <Image
                            src={b.image_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 33vw"
                            unoptimized
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <span className="text-xs font-semibold text-mango-600 uppercase">
                            {b.category}
                          </span>
                          <h3 className="font-bold text-lg text-mango-700">
                            {b.title}
                          </h3>
                          <p className="text-sm text-gray-500">by {b.author}</p>
                          <span className="text-xs text-gray-400 mt-1">
                            📦 {b.available_quantity} copies
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm bg-mango-600 text-white rounded-full w-full mt-2 detail-btn"
                            data-id={b.id}
                            onClick={() => navigateTo(`#/book/${b.id}`)}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  id="no-books-found"
                  className={
                    filteredBooks.length === 0
                      ? "text-center py-16 text-gray-500"
                      : "hidden text-center py-16 text-gray-500"
                  }
                >
                  No books found.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="page-book-details"
          className={sectionActive("book-details")}
        >
          <div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            id="book-details-content"
          >
            {activeBook ? (
              (() => {
                const b = activeBook;
                const avail = b.available_quantity > 0;
                return (
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-2/5 bg-gray-100 flex items-center justify-center p-8">
                        <div className="relative w-full max-h-96 aspect-[400/560] max-w-[280px]">
                          <Image
                            src={b.image_url}
                            alt=""
                            fill
                            className="rounded-xl shadow-lg object-cover"
                            sizes="280px"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="lg:w-3/5 p-8 lg:p-10">
                        <span className="text-sm font-semibold text-mango-600 uppercase">
                          {b.category}
                        </span>
                        <h1 className="font-display text-3xl font-bold text-mango-700 mt-2">
                          {b.title}
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">
                          by <strong>{b.author}</strong>
                        </p>
                        <p className="text-gray-600 mt-4">{b.description}</p>
                        <div className="bg-warm-50 rounded-2xl p-4 mt-6 inline-flex items-center gap-3">
                          <span>📦</span>
                          <span
                            className={`font-bold text-lg ${avail ? "text-green-700" : "text-red-600"}`}
                          >
                            {avail
                              ? `${b.available_quantity} copies left`
                              : "Out of stock"}
                          </span>
                        </div>
                        <button
                          type="button"
                          id="borrow-btn"
                          className={`btn btn-lg rounded-full font-bold mt-6 ${avail ? "bg-mango-600 text-white" : "btn-disabled"}`}
                          disabled={!avail}
                          onClick={avail ? onBorrow : undefined}
                        >
                          {avail ? "📖 Borrow This Book" : "Unavailable"}
                        </button>
                        <a
                          href="#/all-books"
                          className="btn btn-ghost mt-4 rounded-full"
                        >
                          ← Back to All Books
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-20">Book not found.</div>
            )}
          </div>
        </section>

        <section id="page-login" className={sectionActive("login")}>
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-warm-200">
              <h1 className="font-display text-3xl font-bold text-mango-700 text-center mb-6">
                Welcome Back
              </h1>
              <form
                id="login-form"
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = (
                    form.elements.namedItem("login-email") as HTMLInputElement
                  ).value.trim();
                  const pw = (
                    form.elements.namedItem("login-password") as HTMLInputElement
                  ).value;
                  setLoginError("");
                  const user = getUsers().find(
                    (u) =>
                      u.email === email &&
                      u.password === pw &&
                      u.provider === "email",
                  );
                  if (user) {
                    const clean: UserSession = {
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      photo_url: user.photo_url,
                      provider: user.provider,
                    };
                    setCurrentUserLs(clean);
                    setCurrentUser(clean);
                    showToast("Login successful!", "success");
                    navigateTo("#/");
                  } else {
                    setLoginError("Invalid email or password.");
                    showToast("Login failed.", "error");
                  }
                }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="login-email"
                    required
                    placeholder="demo@mango.com"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="login-password"
                    required
                    placeholder="password123"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div
                  id="login-error"
                  className={`text-red-500 text-sm ${loginError ? "" : "hidden"}`}
                >
                  {loginError}
                </div>
                <button
                  type="submit"
                  className="btn bg-mango-600 hover:bg-mango-700 text-white w-full rounded-xl"
                >
                  Login
                </button>
              </form>
              <div className="divider my-4">or</div>
              <button
                type="button"
                id="google-login-btn"
                className="btn btn-outline w-full rounded-xl flex items-center justify-center gap-2"
                onClick={googleAuth}
              >
                <GoogleIcon /> Continue with Google
              </button>
              <p className="text-center text-sm mt-6">
                Don&apos;t have an account?{" "}
                <a href="#/register" className="text-mango-600 font-semibold">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="page-register" className={sectionActive("register")}>
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-warm-200">
              <h1 className="font-display text-3xl font-bold text-mango-700 text-center mb-6">
                Create Account
              </h1>
              <form
                id="register-form"
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (
                    form.elements.namedItem("register-name") as HTMLInputElement
                  ).value.trim();
                  const email = (
                    form.elements.namedItem(
                      "register-email",
                    ) as HTMLInputElement
                  ).value.trim();
                  const photo = (
                    form.elements.namedItem(
                      "register-photo",
                    ) as HTMLInputElement
                  ).value.trim();
                  const pw = (
                    form.elements.namedItem(
                      "register-password",
                    ) as HTMLInputElement
                  ).value;
                  setRegisterError("");
                  if (getUsers().find((u) => u.email === email)) {
                    setRegisterError("Email exists.");
                    showToast("Registration failed.", "error");
                    return;
                  }
                  const newUser: UserStored = {
                    id: Date.now(),
                    name,
                    email,
                    photo_url:
                      photo || "https://picsum.photos/seed/default-user/200/200",
                    password: pw,
                    provider: "email",
                  };
                  const users = getUsers();
                  users.push(newUser);
                  saveUsers(users);
                  showToast("Registered! Please log in.", "success");
                  navigateTo("#/login");
                }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    name="register-name"
                    required
                    placeholder="John Doe"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="register-email"
                    required
                    placeholder="you@example.com"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Photo URL (link)
                  </label>
                  <input
                    type="url"
                    id="register-photo"
                    name="register-photo"
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    name="register-password"
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>
                <div
                  id="register-error"
                  className={`text-red-500 text-sm ${registerError ? "" : "hidden"}`}
                >
                  {registerError}
                </div>
                <button
                  type="submit"
                  className="btn bg-mango-600 hover:bg-mango-700 text-white w-full rounded-xl"
                >
                  Register
                </button>
              </form>
              <div className="divider my-4">or</div>
              <button
                type="button"
                id="google-register-btn"
                className="btn btn-outline w-full rounded-xl flex items-center justify-center gap-2"
                onClick={googleAuth}
              >
                <GoogleIcon /> Continue with Google
              </button>
              <p className="text-center text-sm mt-6">
                Already have an account?{" "}
                <a href="#/login" className="text-mango-600 font-semibold">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="page-profile" className={sectionActive("profile")}>
          <div
            className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            id="profile-content"
          >
            {currentUser ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="w-28 h-28 rounded-full overflow-hidden profile-avatar relative shrink-0">
                    <Image
                      src={
                        currentUser.photo_url ||
                        "https://picsum.photos/seed/default-user/200/200"
                      }
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="font-display text-3xl font-bold text-mango-700">
                      {currentUser.name}
                    </h1>
                    <p className="text-gray-500">{currentUser.email}</p>
                    <span className="text-xs bg-mango-100 text-mango-700 px-3 py-1 rounded-full">
                      {currentUser.provider === "google"
                        ? "🔗 Google"
                        : "📧 Email"}
                    </span>
                  </div>
                </div>
                <div className="bg-warm-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-lg text-mango-700 mb-3">
                    Account Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>ID:</div>
                    <div>{currentUser.id}</div>
                    <div>Provider:</div>
                    <div>{currentUser.provider}</div>
                    <div>Name:</div>
                    <div>{currentUser.name}</div>
                    <div>Email:</div>
                    <div>{currentUser.email}</div>
                  </div>
                </div>
                <a
                  href="#/update-profile"
                  className="btn btn-lg bg-mango-600 text-white rounded-full px-8"
                >
                  ✏️ Update Information
                </a>
              </div>
            ) : null}
          </div>
        </section>

        <section
          id="page-update-profile"
          className={sectionActive("update-profile")}
        >
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="font-display text-3xl font-bold text-mango-700 text-center mb-6">
                Update Profile
              </h1>
              <form
                id="update-profile-form"
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const u = currentUser;
                  if (!u) return;
                  const nu = {
                    ...u,
                    name: updateName.trim() || u.name,
                    photo_url: updatePhoto.trim() || u.photo_url,
                  };
                  setCurrentUserLs(nu);
                  setCurrentUser(nu);
                  const users = getUsers();
                  const idx = users.findIndex((x) => x.id === u.id);
                  if (idx !== -1) {
                    users[idx].name = nu.name;
                    users[idx].photo_url = nu.photo_url;
                    saveUsers(users);
                  }
                  showToast("Profile updated!", "success");
                  navigateTo("#/profile");
                }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    id="update-photo"
                    placeholder="https://example.com/photo.jpg"
                    className="input input-bordered w-full rounded-xl"
                    value={updatePhoto}
                    onChange={(e) => setUpdatePhoto(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="update-name"
                    required
                    placeholder="Your name"
                    className="input input-bordered w-full rounded-xl"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-mango-600 hover:bg-mango-700 text-white w-full rounded-xl"
                >
                  Update Information
                </button>
              </form>
              <a
                href="#/profile"
                className="btn btn-ghost w-full mt-4 rounded-xl"
              >
                ← Back to Profile
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white mt-auto relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-display text-2xl font-bold mb-3">
                <span>🥭</span>
                <span>Mango</span>
              </div>
              <p className="text-gray-400 text-sm max-w-xs">
                Your digital library companion.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#/" className="hover:text-mango-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#/all-books"
                    className="hover:text-mango-400 transition-colors"
                  >
                    All Books
                  </a>
                </li>
                <li>
                  <a
                    href="#/profile"
                    className="hover:text-mango-400 transition-colors"
                  >
                    My Profile
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <span>📧</span> support@mango-books.com
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span> 142 Mango Lane, Booktown
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="social-icon"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="social-icon"
                  title="Twitter"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="social-icon"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="social-icon"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="social-icon"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
            &copy; 2026 Mango. All rights reserved. Built with ❤️ for readers
            everywhere.
          </div>
        </div>
      </footer>
    </>
  );
}
