import type { Metadata } from "next";
import "../../src/styles/globals.css";
import Providers from "./Providers ";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s | مراسل جدة العقاري",
    default: "مراسل جدة العقاري",
  },
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className="flex flex-col">
        <Providers>
          <Toaster />

          {children}
        </Providers>
      </body>
    </html>
  );
}
