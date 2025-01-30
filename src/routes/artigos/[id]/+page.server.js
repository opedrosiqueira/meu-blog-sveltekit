import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
    const [artigo] = await db.select({
        id: table.artigo.id, titulo: table.artigo.titulo, subtitulo: table.artigo.subtitulo, conteudo: table.artigo.conteudo,
        atualizadoEm: table.artigo.atualizadoEm, criadoEm: table.artigo.criadoEm, autorId: table.artigo.autorId, autor: table.user.username
    }).from(table.artigo).where(eq(table.artigo.id, params.id)).innerJoin(table.user, eq(table.artigo.autorId, table.user.id)).limit(1);

    return { artigo };
};
