import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "MechMate · First-year engineering organizer";
const description = "A focused mobile course organizer for first-year mechanical engineering students.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = new URL(`${protocol}://${host}`);

  return {
    metadataBase: origin,
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "MechMate — your first year, under control" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
