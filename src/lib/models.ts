import { Schema, model, models } from 'mongoose';

// --- Partner Model ---
const PartnerSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    logo: { type: String, required: true }, // Image URL
    description: { type: String },
    programs: [{ type: Schema.Types.ObjectId, ref: 'Program' }],
    enrollLink: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const Partner = models.Partner || model('Partner', PartnerSchema);

// --- Program Model ---
const ProgramSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            'Degree Breaking',
            'Fast Track',
            'Credit Transfer',
            'Online Degree',
            'Secondary (10th)',
            'Senior Secondary (12th)',
            'Diploma',
            'Attestation'
        ]
    },
    icon: { type: String }, // Lucide icon name or image
    content: { type: String }, // Detailed rich text
    slug: { type: String, unique: true },
    // SEO Fields
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: [String], default: [] },
}, { timestamps: true });

export const Program = models.Program || model('Program', ProgramSchema);

// --- Site Config Model (Global SEO) ---
const SiteConfigSchema = new Schema({
    key: { type: String, default: 'global-seo', unique: true }, // Singleton pattern
    title: { type: String, default: 'Learnink Education' },
    description: { type: String, default: 'Linking Learning, Skills & Careers' },
    keywords: { type: [String], default: [] },
    favicon: { type: String },
    ogImage: { type: String },
    robotsTxt: { type: String, default: "User-agent: *\nAllow: /" },
    googleAnalyticsId: { type: String },
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        youtube: { type: String }
    },
    googleVerification: { type: String },
    twitterHandle: { type: String },
    images: {
        logo: { type: String },
        heroBg: { type: String },
        aboutImage: { type: String }
    },
}, { timestamps: true });

export const SiteConfig = models.SiteConfig || model('SiteConfig', SiteConfigSchema);

// --- Enquiry Model ---
const EnquirySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    interest: { type: String },
    message: { type: String },
    status: { type: String, default: 'new', enum: ['new', 'contacted', 'resolved'] },
}, { timestamps: true });

export const Enquiry = models.Enquiry || model('Enquiry', EnquirySchema);

// --- Subscriber Model (Newsletter) ---
const SubscriberSchema = new Schema({
    email: { type: String, required: true, unique: true },
    status: { type: String, default: 'active', enum: ['active', 'unsubscribed'] },
}, { timestamps: true });

export const Subscriber = models.Subscriber || model('Subscriber', SubscriberSchema);

// --- Page SEO Model (Per-Page SEO Settings) ---
const PageSEOSchema = new Schema({
    pageKey: { type: String, required: true, unique: true }, // e.g., 'about', 'contact', 'partners', 'programs'
    title: { type: String },
    description: { type: String },
    keywords: { type: [String], default: [] },
    ogImage: { type: String },
    enabled: { type: Boolean, default: true },
}, { timestamps: true });

export const PageSEO = models.PageSEO || model('PageSEO', PageSEOSchema);

// --- Gallery Model ---
const GalleryPhotoSchema = new Schema({
    imageUrl: { type: String, required: true },
    caption: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const GalleryPhoto = models.GalleryPhoto || model('GalleryPhoto', GalleryPhotoSchema);

// --- Testimonial Model ---
const TestimonialSchema = new Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    role: { type: String },
    imageUrl: { type: String },
    rating: { type: Number, default: 5 },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export const Testimonial = models.Testimonial || model('Testimonial', TestimonialSchema);

// --- Integration Config Model (Private Admin Settings) ---
const IntegrationConfigSchema = new Schema({
    key: { type: String, default: 'crm-integration', unique: true },
    crmWebhookUrl: { type: String },
    crmAuthToken: { type: String },
    enabled: { type: Boolean, default: false },
}, { timestamps: true });


// --- User Model (Admin Auth) ---
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin', 'editor'] },
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);

export const IntegrationConfig = models.IntegrationConfig || model('IntegrationConfig', IntegrationConfigSchema);
