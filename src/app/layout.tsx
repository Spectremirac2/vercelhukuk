import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ApiSettingsProvider } from "@/contexts/ApiSettingsContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { SkipLinks } from "@/components/accessibility/SkipLinks";
import { ScreenReaderAnnouncer } from "@/components/accessibility/ScreenReaderAnnouncer";

// Font configurations
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Hukuk AI Chat - Türk Hukuku Araştırma Asistanı",
  description: "Türk hukuku araştırması için AI destekli chat uygulaması. Mevzuat, içtihat ve hukuki süreçlerle ilgili sorularınızı doğrulanabilir kaynaklara dayalı yanıtlarla cevaplayın.",
  keywords: ["türk hukuku", "hukuk araştırma", "mevzuat", "içtihat", "AI asistan", "hukuki danışman"],
  authors: [{ name: "Hukuk AI" }],
  openGraph: {
    title: "Hukuk AI Chat",
    description: "Türk hukuku araştırması için AI destekli chat uygulaması",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        <ErrorBoundary>
          <AccessibilityProvider>
            <ThemeProvider>
              <ApiSettingsProvider>
                {/* Skip links for keyboard/screen reader navigation */}
                <SkipLinks />
                {/* Screen reader live region announcer */}
                <ScreenReaderAnnouncer />
                {children}
              </ApiSettingsProvider>
            </ThemeProvider>
          </AccessibilityProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
