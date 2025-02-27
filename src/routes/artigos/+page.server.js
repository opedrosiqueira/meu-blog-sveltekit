import { db } from '$lib/server/db';
import { artigo } from '$lib/server/db/schema';

export const load = async () => {
    const artigos = await db.select({ id: artigo.id, titulo: artigo.titulo, subtitulo: artigo.subtitulo, atualizadoEm: artigo.atualizadoEm }).from(artigo).orderBy(artigo.atualizadoEm, 'desc');
    return { artigos };
};
