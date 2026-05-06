import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                color: "#0f172a",
                background: "#ffffff"
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}