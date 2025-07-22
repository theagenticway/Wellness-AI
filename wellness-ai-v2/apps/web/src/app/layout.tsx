import type { Metadata } from "next";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { GlobalStyles } from "@/styles/GlobalStyles";
import "./globals.css";

export const metadata: Metadata = {
  title: "WellnessAI - Personalized Wellness Platform",
  description: "AI-powered personalized wellness platform for nutrition, fitness, mindfulness, and cognitive behavioral therapy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Manrope:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <SessionProvider>
            <GlobalStyles />
            {children}
          </SessionProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
