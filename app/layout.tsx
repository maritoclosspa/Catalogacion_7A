import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Series 7A",
  description: "Catálogo personal de series y valoraciones",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
