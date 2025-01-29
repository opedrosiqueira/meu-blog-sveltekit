import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import * as table from './schema.js';

const client = createClient({ url: "file:local.db" });
export const db = drizzle(client);

async function seed() {
    console.log('Seeding database...');

    await db.delete(table.user).where(eq(table.user.username, 'testuser'));

    await db.insert(table.user).values([
        { username: 'testuser', passwordHash: 'hashedpassword' }
    ]);

    console.log('Database seeded successfully.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
