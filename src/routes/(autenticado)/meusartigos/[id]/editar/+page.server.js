import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
    if (params.id != 'novo') {
        const artigos = await db.select().from(table.artigo).where(eq(table.artigo.id, params.id));
        return { artigos };
    }
};

export const actions = {
    criar: async (event) => {
        const formData = await event.request.formData();
        const titulo = formData.get('titulo').trim();
        const subtitulo = formData.get('subtitulo').trim();
        const conteudo = formData.get('conteudo').trim();
        const autorId = event.locals.session.userId;
        try {
            await db.insert(table.artigo).values({ titulo, subtitulo, conteudo, autorId });
        } catch (e) {
            return fail(400, { erro: 'Ocorreu um erro: ' + e.message });
        }
        return redirect(302, '/meusartigos'); // todolist redirecionar para a página do artigo
    },
    editar: async (event) => {
        const formData = await event.request.formData();
        const nome = formData.get('nome');
        const id = formData.get('id');
        await db.update(table.categoria).set({ nome }).where(eq(table.categoria.id, id));
        return redirect(302, '/categorias');
    }
};
