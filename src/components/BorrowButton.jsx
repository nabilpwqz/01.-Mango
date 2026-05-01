"use client";

import toast from "react-hot-toast";

export default function BorrowButton({ disabled }) {
  const handleBorrow = () => {
    toast.success("Borrow request submitted successfully!");
  };

  return (
    <button
      className="btn-pro btn-pro-primary w-full"
      onClick={handleBorrow}
      disabled={disabled}
      style={disabled ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
    >
      Borrow This Book
    </button>
  );
}
