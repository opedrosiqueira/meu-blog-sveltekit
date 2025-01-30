import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load = async () => {
    const artigos = await db.select({ id: table.artigo.id, titulo: table.artigo.titulo, subtitulo: table.artigo.subtitulo, atualizadoEm: table.artigo.atualizadoEm }).from(table.artigo).orderBy(table.artigo.atualizadoEm, 'desc');
    return { artigos };
};
