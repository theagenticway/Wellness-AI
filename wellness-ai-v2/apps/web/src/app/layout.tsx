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
