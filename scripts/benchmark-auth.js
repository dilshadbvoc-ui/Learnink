/* eslint-disable */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function benchmark() {
    try {
        console.log('--- Starting Benchmark ---');

        // 1. Load Enviroment
        const envPath = path.resolve(process.cwd(), '.env.local');
        let mongoUri = process.env.MONGODB_URI;

        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split(/\r?\n/).forEach(line => {
                const [key, val] = line.split('=');
                if (key && val && key.trim() === 'MONGODB_URI') {
                    mongoUri = val.trim().replace(/"/g, '');
                }
            });
        }

        if (!mongoUri) {
            console.error('No MONGODB_URI found.');
            process.exit(1);
        }

        // Clean URI if needed (same logic as seed script)
        if (mongoUri.endsWith('appName')) {
            mongoUri += '=Benchmark';
        } else if (mongoUri.includes('appName&')) {
            mongoUri = mongoUri.replace('appName&', 'appName=Benchmark&');
        } else if (mongoUri.includes('appName=') && (mongoUri.endsWith('appName=') || mongoUri.includes('appName=&'))) {
            mongoUri = mongoUri.replace('appName=', 'appName=Benchmark');
        }

        // 2. Measure DB Connect
        console.log('1. Connecting to MongoDB...');
        const t0 = performance.now();
        await mongoose.connect(mongoUri);
        const t1 = performance.now();
        console.log(`   > Connected in: ${(t1 - t0).toFixed(2)}ms`);

        // Define User Schema
        const UserSchema = new mongoose.Schema({
            username: { type: String },
            password: { type: String },
        });
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // 3. Measure User Lookup
        console.log('2. Finding Admin User...');
        const t2 = performance.now();
        const user = await User.findOne({ username: 'admin' });
        const t3 = performance.now();
        console.log(`   > Found user in: ${(t3 - t2).toFixed(2)}ms`);

        if (!user) {
            console.error('Admin user not found!');
            process.exit(1);
        }

        // 4. Measure Bcrypt Compare
        console.log('3. Verifying Password (bcryptjs)...');
        const t4 = performance.now();
        await bcrypt.compare('LearninkAdmin@2025', user.password);
        const t5 = performance.now();
        console.log(`   > Compared hash in: ${(t5 - t4).toFixed(2)}ms`);

        console.log('--- Benchmark Complete ---');
        console.log(`Total Critical Path: ${(t1 - t0) + (t3 - t2) + (t5 - t4)}ms`);

        await mongoose.disconnect();

    } catch (e) {
        console.error(e);
    }
}

benchmark();
