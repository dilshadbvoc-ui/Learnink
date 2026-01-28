/* eslint-disable */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');


function log(message) {
    const msg = `[${new Date().toISOString()}] ${message}\n`;
    console.log(message);
    fs.appendFileSync('seed.log', msg);
}

function logError(message, error) {
    const msg = `[${new Date().toISOString()}] ERROR: ${message}\n${error?.stack || error}\n`;
    console.error(message, error);
    fs.appendFileSync('seed.log', msg);
}

async function seedAdmin() {
    try {
        fs.writeFileSync('seed.log', 'Starting seed script...\n');

        // 1. Load Environment Variables from .env.local
        const envPath = path.resolve(process.cwd(), '.env.local');
        let mongoUri = process.env.MONGODB_URI;

        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split(/\r?\n/).forEach(line => {
                const [key, val] = line.split('=');
                if (key && val && key.trim() === 'MONGODB_URI') {
                    mongoUri = val.trim().replace(/"/g, '');

                    // Log raw URI structure (masked)
                    log('Raw URI structure: ' + mongoUri.replace(/:([^@]+)@/, ':****@'));

                    // Aggressively fix appName parameter
                    if (mongoUri.endsWith('appName')) {
                        log('Appending value to incomplete appName parameter...');
                        mongoUri += '=SeedScript';
                    } else if (mongoUri.includes('appName&')) {
                        log('Fixing incomplete appName parameter in middle of string...');
                        mongoUri = mongoUri.replace('appName&', 'appName=SeedScript&');
                    } else if (mongoUri.includes('appName=') && (mongoUri.endsWith('appName=') || mongoUri.includes('appName=&'))) {
                        log('Fixing empty appName value...');
                        mongoUri = mongoUri.replace('appName=', 'appName=SeedScript');
                    }
                }
            });
        }

        if (!mongoUri) {
            logError('MONGODB_URI not found in .env.local');
            // Check if .env.local exists
            if (!fs.existsSync(envPath)) {
                logError('.env.local file does not exist at: ' + envPath);
            } else {
                logError('.env.local exists but MONGODB_URI not found in it.');
            }
            process.exit(1);
        }

        log('Connecting to MongoDB at: ' + mongoUri.substring(0, 20) + '...');

        /* 
           Set stricter timeout to fail fast if network is down. 
           But actually, default is 30s. 
           Let's just connect.
        */
        await mongoose.connect(mongoUri);
        log('Connected.');

        // 2. Define User Schema (Simplified matches src/lib/models.ts)
        const UserSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: 'admin', enum: ['admin', 'editor'] },
        }, { timestamps: true });

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // 3. Create Admin User
        const username = 'admin';
        const password = 'LearninkAdmin@2025';

        log(`Checking for user: ${username}`);
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            log(`User '${username}' already exists.`);
        } else {
            log(`Creating user: ${username}`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username,
                password: hashedPassword,
                role: 'admin',
            });
            log(`User '${username}' created successfully.`);
        }

        await mongoose.disconnect();
        log('Done.');
    } catch (error) {
        logError('Seeding failed with error:', error);
        if (error.reason) logError('Reason:', error.reason);
        process.exit(1);
    }
}

seedAdmin();
