import { MetadataRoute } from 'next';
import { SiteConfig } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export default async function robots(): Promise<MetadataRoute.Robots> {
    try {
        await dbConnect();
        const config = await SiteConfig.findOne({ key: 'global-seo' }).lean();

        if (config?.robotsTxt) {
            // Very basic parsing for custom robots.txt content if needed
            // For now, we return the standard object structure if we can parse it, 
            // or we might need a different approach if we want to serve raw text.
            // Next.js robots() returns an object. 
            // If the user pasted "User-agent: *\nDisallow: /admin", we map this.

            return {
                rules: {
                    userAgent: '*',
                    allow: '/',
                    disallow: '/admin/',
                },
                sitemap: `https://learnink.edu.in/sitemap.xml`, // Replace with actual domain
            };
        }
    } catch (e) {
        console.error("Failed to fetch robots config", e);
    }

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: 'https://learnink.edu.in/sitemap.xml',
    };
}
