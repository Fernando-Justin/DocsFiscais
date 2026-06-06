import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocsFiscais - Gerenciador do Ecossistema",
  description: "Gerenciador de Ecossistema de Aplicativos Fiscais com alta densidade de informações e arquitetura de dados otimizada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
