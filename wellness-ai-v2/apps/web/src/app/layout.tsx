import type { Metadata } from "next";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
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
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
