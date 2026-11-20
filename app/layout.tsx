import type { Metadata } from "next";
import "./globals.css"; // <-- ESTA LÍNEA ES LA CLAVE

export const metadata: Metadata = {
  title: "Mini Canva",
  description: "Creador de carteles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}