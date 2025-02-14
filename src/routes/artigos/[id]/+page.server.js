import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
    const [artigo] = await db.select({
        id: table.artigo.id, titulo: table.artigo.titulo, subtitulo: table.artigo.subtitulo, conteudo: table.artigo.conteudo,
        atualizadoEm: table.artigo.atualizadoEm, criadoEm: table.artigo.criadoEm, autorId: table.artigo.autorId, autor: table.user.username
    }).from(table.artigo).where(eq(table.artigo.id, params.id)).innerJoin(table.user, eq(table.artigo.autorId, table.user.id)).limit(1);

    if (!artigo) error(404, { message: 'Not found' });

    const comentarios = await db.select({
        id: table.comentario.id, conteudo: table.comentario.conteudo, criadoEm: table.comentario.criadoEm, autorId: table.comentario.autorId, autor: table.user.username
    }).from(table.comentario).where(eq(table.comentario.artigoId, params.id)).innerJoin(table.user, eq(table.comentario.autorId, table.user.id)).orderBy(table.comentario.criadoEm, 'asc');

    return { artigo, comentarios };
};

export const actions = {
    comentar: async (event) => {
        const formData = await event.request.formData();
        const artigoId = formData.get('artigoId');
        const autorId = formData.get('autorId');
        const conteudo = formData.get('conteudo');

        if (!conteudo.trim() || conteudo.length < 2 || conteudo.length > 512) return fail(400, { erro: 'Comentário com tamanho inadequado!' });

        try {
            await db.insert(table.comentario).values({ artigoId, autorId, conteudo });
        } catch (e) {
            return fail(500, { erro: 'Erro ao salvar comentário: ' + e.message });
        }

        return redirect(302, `/artigos/${artigoId}`);
    }
};
