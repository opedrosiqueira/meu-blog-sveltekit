import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async () => {
    const artigos = await db.select({ id: table.artigo.id, titulo: table.artigo.titulo }).from(table.artigo);
    return { artigos };
};
