import { MetadataRoute } from 'next';
import { Program } from '@/lib/models';
import dbConnect from '@/lib/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learnink.edu.in';

    // Static routes with differentiated priorities
    const staticRoutes = [
        { route: '', priority: 1.0, changeFrequency: 'daily' as const },
        { route: '/programs', priority: 0.9, changeFrequency: 'daily' as const },
        { route: '/about', priority: 0.7, changeFrequency: 'weekly' as const },
        { route: '/partners', priority: 0.7, changeFrequency: 'weekly' as const },
        { route: '/contact', priority: 0.8, changeFrequency: 'weekly' as const },
        { route: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
        { route: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
    ].map((item) => ({
        url: `${baseUrl}${item.route}`,
        lastModified: new Date(),
        changeFrequency: item.changeFrequency,
        priority: item.priority,
    }));

    try {
        await dbConnect();
        const programs = await Program.find({}).select('slug updatedAt').lean();

        const programRoutes = programs
            .filter(program => program.slug) // Only include programs with slugs
            .map((program) => ({
                url: `${baseUrl}/programs/${program.slug}`,
                lastModified: new Date(program.updatedAt),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));

        return [...staticRoutes, ...programRoutes];
    } catch (error) {
        console.error("Failed to generate sitemap", error);
        return staticRoutes;
    }
}
