import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
    const artigos = await db.select({ id: table.artigo.id, titulo: table.artigo.titulo, subtitulo: table.artigo.subtitulo, atualizadoEm: table.artigo.atualizadoEm }).from(table.artigo).where(eq(table.artigo.autorId, event.locals.user.id)).orderBy(table.artigo.atualizadoEm, 'desc');
    return { artigos };
};
