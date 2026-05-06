"use client";

import toast from "react-hot-toast";

export default function BorrowButton({ disabled }) {
  const handleBorrow = () => {
    if (typeof window === "undefined") return;
    const ok = window.confirm("Confirm borrowing this book? You can pick it up once the librarian approves.");
    if (!ok) {
      toast("Borrow cancelled", { icon: "ℹ️" });
      return;
    }
    toast.success("Borrow confirmed! Request submitted.");
  };

  return (
    <button
      type="button"
      className="btn-pro btn-pro-primary w-full"
      onClick={handleBorrow}
      disabled={disabled}
      style={disabled ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
    >
      Borrow This Book
    </button>
  );
}
