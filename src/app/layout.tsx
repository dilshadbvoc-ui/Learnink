import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { OrganizationSchema, WebSiteSchema } from "@/components/JsonLd";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

import { SiteConfig } from "@/lib/models";
import dbConnect from "@/lib/mongodb";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://learnink.edu.in";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const config = await SiteConfig.findOne({ key: 'global-seo' }).lean();

    if (config) {
      const socialLinks = [];
      if (config.socialLinks?.facebook) socialLinks.push(config.socialLinks.facebook);
      if (config.socialLinks?.twitter) socialLinks.push(config.socialLinks.twitter);
      if (config.socialLinks?.instagram) socialLinks.push(config.socialLinks.instagram);
      if (config.socialLinks?.linkedin) socialLinks.push(config.socialLinks.linkedin);
      if (config.socialLinks?.youtube) socialLinks.push(config.socialLinks.youtube);

      return {
        title: {
          default: config.title || "Learnink Education | Linking Learning, Skills & Careers",
          template: `%s | ${config.title || "Learnink Education"}`,
        },
        description: config.description,
        keywords: config.keywords,
        icons: config.favicon ? { icon: config.favicon } : undefined,
        metadataBase: new URL(siteUrl),
        alternates: {
          canonical: siteUrl,
        },
        openGraph: {
          title: config.title,
          description: config.description,
          url: siteUrl,
          siteName: config.title || "Learnink Education",
          images: config.ogImage ? [{ url: config.ogImage, width: 1200, height: 630 }] : undefined,
          locale: 'en_IN',
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: config.title,
          description: config.description,
          site: config.twitterHandle || '@learnink',
          images: config.ogImage ? [config.ogImage] : undefined,
        },
        verification: {
          google: config.googleVerification || undefined,
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
      };
    }
  } catch (e) {
    console.error("Failed to fetch global SEO", e);
  }

  // Fallback
  return {
    title: {
      default: "Learnink Education | Linking Learning, Skills & Careers",
      template: "%s | Learnink Education",
    },
    description: "Learnink Education Pvt Ltd is an all-in-one education platform offering degree programs, fast track courses, and more.",
    metadataBase: new URL(siteUrl),
  };
}

async function getSiteConfig() {
  try {
    await dbConnect();
    return await SiteConfig.findOne({ key: 'global-seo' }).lean();
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  const socialLinks: string[] = [];
  if (config?.socialLinks?.facebook) socialLinks.push(config.socialLinks.facebook);
  if (config?.socialLinks?.twitter) socialLinks.push(config.socialLinks.twitter);
  if (config?.socialLinks?.instagram) socialLinks.push(config.socialLinks.instagram);
  if (config?.socialLinks?.linkedin) socialLinks.push(config.socialLinks.linkedin);
  if (config?.socialLinks?.youtube) socialLinks.push(config.socialLinks.youtube);

  return (
    <html lang="en" className="scroll-smooth scroll-pt-28">
      <head>
        <OrganizationSchema
          name={config?.title || "Learnink Education"}
          description={config?.description || "Linking Learning, Skills & Careers"}
          url={siteUrl}
          logo={config?.ogImage}
          sameAs={socialLinks}
        />
        <WebSiteSchema
          name={config?.title || "Learnink Education"}
          url={siteUrl}
        />
      </head>
      <body
        className={`${plusJakarta.variable} font-sans antialiased bg-slate-50 text-slate-900 selection:bg-primary/20 selection:text-primary overflow-x-hidden`}
      >
        <Providers>
          {config?.googleAnalyticsId && <GoogleAnalytics gaId={config.googleAnalyticsId} />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
