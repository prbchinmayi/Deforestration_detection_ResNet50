import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Deforestation Detection",
  description: "ResNet50 land-cover classification and deforestation detection dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${grotesk.variable} ${plexMono.variable}`}>{children}</body>
    </html>
  );
}