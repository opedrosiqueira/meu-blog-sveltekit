import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
    if (params.id !== 'novo') {
        const [artigo] = await db.select().from(table.artigo).where(eq(table.artigo.id, params.id)).limit(1);
        return { artigo };
    }
};

export const actions = {
    salvar: async (event) => {
        const formData = await event.request.formData();
        let id = formData.get('id');
        const titulo = formData.get('titulo')?.trim();
        const subtitulo = formData.get('subtitulo')?.trim();
        const conteudo = formData.get('conteudo')?.trim();

        if (!titulo || !subtitulo || !conteudo) return fail(400, { erro: 'Preencha todos os campos.', titulo, subtitulo, conteudo });

        try {
            if (id) {
                await db.update(table.artigo).set({ titulo, subtitulo, conteudo }).where(eq(table.artigo.id, id));
            } else {
                [{ id }] = await db.insert(table.artigo).values({ titulo, subtitulo, conteudo, autorId: event.locals.session.userId }).returning({ id: table.artigo.id });
            }
        } catch (e) {
            console.error('Erro ao salvar artigo:', e);
            return fail(500, { erro: 'Ocorreu um erro ao salvar o artigo.', titulo, subtitulo, conteudo });
        }

        return redirect(302, '/artigos/' + id);
    },

    excluir: async (event) => {
        const formData = await event.request.formData();
        const id = formData.get('id');

        try {
            await db.delete(table.artigo).where(eq(table.artigo.id, id));
        } catch (e) {
            console.error('Erro ao excluir artigo:', e);
            return fail(500, { erro: 'Não foi possível excluir o artigo.' });
        }

        throw redirect(302, '/meusartigos');
    }
};
