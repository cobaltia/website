import "~/styles/globals.css";
import { type Viewport, type Metadata } from "next";
import { ThemeProvider } from "~/components/theme-provider";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ReactQueryProvider } from "~/components/react-query-provider";
import AuthenticatedProvider from "~/contexts/AuthenticationContext";
import DiscordPackProvider from "~/contexts/DiscordPackContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cobalt Network",
  description: "The official website of Cobalt Network.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiasedbackground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthenticatedProvider>
            <DiscordPackProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </DiscordPackProvider>
          </AuthenticatedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
