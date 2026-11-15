import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JourneyProvider } from "@/context/JourneyContext";
import MinimalHUD from "@/components/navigation/MinimalHUD";

export const metadata: Metadata = {
  title: "Dancing with the SARs | NASA Space Apps Challenge",
  description:
    "An immersive, scientifically honest Earth observation journey from space to Uttarakhand, India using calibrated NISAR satellite radar observations.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#020408",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-space-950">
      <body className="antialiased min-h-screen bg-space-950 text-slate-100 flex flex-col overflow-hidden">
        <JourneyProvider>
          <MinimalHUD />
          <main className="relative flex-1 w-full h-full overflow-hidden">
            {children}
          </main>
        </JourneyProvider>
      </body>
    </html>
  );
}
