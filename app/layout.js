import { Anton, Manrope } from "next/font/google";
import "./globals.css";
import "../styles.css";
import SiteFooter from "../components/SiteFooter";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"]
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  title: "Official Curtis Riggleman",
  description:
    "Sales leadership and dealership training built to elevate confidence, consistency, and income."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${anton.variable} ${manrope.variable}`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
