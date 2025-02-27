import { db } from '$lib/server/db';
import * as tabela from '$lib/server/db/schema';
import { fail, redirect, error } from '@sveltejs/kit';
import { eq, asc } from 'drizzle-orm';

export const load = async ({ params }) => {
    const [artigo] = await db.select({
        id: tabela.artigo.id, titulo: tabela.artigo.titulo, subtitulo: tabela.artigo.subtitulo, conteudo: tabela.artigo.conteudo,
        atualizadoEm: tabela.artigo.atualizadoEm, criadoEm: tabela.artigo.criadoEm, autorId: tabela.artigo.autorId, autor: tabela.user.name
    }).from(tabela.artigo).where(eq(tabela.artigo.id, params.id)).innerJoin(tabela.user, eq(tabela.artigo.autorId, tabela.user.id)).limit(1);

    if (!artigo) error(404, { message: 'Artigo não encontrado' });

    const comentarios = await db.select({
        id: tabela.comentario.id, conteudo: tabela.comentario.conteudo, criadoEm: tabela.comentario.criadoEm, autorId: tabela.comentario.autorId, autor: tabela.user.name, autorImagem: tabela.user.image
    }).from(tabela.comentario).where(eq(tabela.comentario.artigoId, params.id)).innerJoin(tabela.user, eq(tabela.comentario.autorId, tabela.user.id)).orderBy(asc(tabela.comentario.criadoEm));

    return { artigo, comentarios };
};

export const actions = {
    comentar: async (event) => {
        const formData = await event.request.formData();
        const artigoId = formData.get('artigoId');
        const autorId = formData.get('autorId');
        const conteudo = formData.get('conteudo')?.trim();

        if (!conteudo || conteudo.length < 2 || conteudo.length > 512) {
            return fail(400, { erro: 'Comentário deve ter entre 2 e 512 caracteres' });
        }

        try {
            await db.insert(tabela.comentario).values({ artigoId, autorId, conteudo });
        } catch (e) {
            return fail(500, { erro: 'Erro ao salvar comentário: ' + e.message });
        }

        return redirect(302, `/artigos/${artigoId}`);
    }
};
