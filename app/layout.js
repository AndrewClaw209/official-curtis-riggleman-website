import { Anton, Manrope } from "next/font/google";
import "./globals.css";
import "../styles.css";
import SiteFooter from "../components/SiteFooter";
import BookCart from "../components/BookCart";
import SiteNav from "../components/SiteNav";

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
  metadataBase: new URL("https://officialcurtisriggleman.com"),
  title: {
    default: "Official Curtis Riggleman | Sales Training & Leadership",
    template: "%s | Official Curtis Riggleman"
  },
  description:
    "Curtis Riggleman provides practical sales training, dealership coaching, leadership development, books, and Riggleman University programs.",
  applicationName: "Official Curtis Riggleman",
  generator: "Next.js",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Official Curtis Riggleman",
    title: "Official Curtis Riggleman | Sales Training & Leadership",
    description:
      "Practical sales training, dealership coaching, leadership development, books, and Riggleman University programs.",
    images: [
      {
        url: "/assets/logo-curtis-riggleman-clean.png",
        width: 967,
        height: 400,
        alt: "Official Curtis Riggleman"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Curtis Riggleman | Sales Training & Leadership",
    description:
      "Practical sales training, dealership coaching, leadership development, books, and Riggleman University programs.",
    images: ["/assets/logo-curtis-riggleman-clean.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${anton.variable} ${manrope.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://officialcurtisriggleman.com/#curtis-riggleman",
                  name: "Curtis Riggleman",
                  url: "https://officialcurtisriggleman.com/",
                  image: "https://officialcurtisriggleman.com/assets/curtis-contact.png",
                  jobTitle: "Sales Trainer and Leadership Coach",
                  sameAs: [
                    "https://www.instagram.com/officialcurtisriggleman/",
                    "https://www.facebook.com/curtis.riggleman.5",
                    "https://www.tiktok.com/@curtisriggleman",
                    "https://www.youtube.com/@OfficialCurtisRiggleman"
                  ],
                  knowsAbout: [
                    "Automotive sales training",
                    "Dealership leadership",
                    "Sales coaching",
                    "Customer objections",
                    "Sales management"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://officialcurtisriggleman.com/#website",
                  url: "https://officialcurtisriggleman.com/",
                  name: "Official Curtis Riggleman",
                  description: "Sales training and leadership development for dealership teams.",
                  publisher: { "@id": "https://officialcurtisriggleman.com/#curtis-riggleman" }
                }
              ]
            })
          }}
        />
        <SiteNav />
        {children}
        <BookCart showTrigger={false} />
        <SiteFooter />
      </body>
    </html>
  );
}
