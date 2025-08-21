import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import { LoadingProvider } from "./contexts/LoadingContext";
import GlobalLoadingScreen from "./components/GlobalLoadingScreen";

export const metadata: Metadata = {
  title: "UGF | A student-run fund",
  description: "University Growth Fund",
  openGraph: {
    title: "UGF | A student-run fund",
    description: "University Growth Fund",
    url: "https://www.debateparlor.com",
    images: [
      {
        url: "https://www.debateparlor.com/airplane.jpg",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen">
        <LoadingProvider>
          <GlobalLoadingScreen />
          <div className="w-full flex-1">
            <main>{children}</main>
          </div>
          <div className="w-full relative z-20">
            <Footer />
          </div>
        </LoadingProvider>
      </body>
    </html>
  );
}
