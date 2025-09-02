import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vote",
  description: "Voting App",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-tr from-blue-400 via-green-500 to-blue-500"
      >
        {children}
      </body>
    </html>
  );
}
