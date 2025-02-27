import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';

export const load = async (event) => {
    return { user: event.locals.user };
};

export const actions = {
    default: async (event) => {
        const dadosFormulario = await event.request.formData();
        const name = dadosFormulario.get('nomeUsuario');
        const password = dadosFormulario.get('senha');
        const novaSenha1 = dadosFormulario.get('senha1');
        const novaSenha2 = dadosFormulario.get('senha2');
        const imagem = dadosFormulario.get('imagem');

        if (novaSenha1 !== novaSenha2) return fail(400, { erro: 'As senhas não conferem' });

        try {
            await auth.authenticateUser(event.locals.user.name, password);

            if (novaSenha1) await auth.updatePassword(event.locals.user.id, novaSenha1);

            if (name && name !== event.locals.user.name) {
                await db.update(table.user).set({ name }).where(eq(table.user.id, event.locals.user.id));
                event.locals.user.name = name;
            }

            if (imagem && imagem.size) {
                const caminhoImagem = '/banco/user/image';
                const nomeImagem = `user-${event.locals.user.id}`;

                await db.update(table.user).set({ image: `${caminhoImagem}/${nomeImagem}` })
                    .where(eq(table.user.id, event.locals.user.id));
                event.locals.user.image = `${caminhoImagem}/${nomeImagem}`;

                fs.mkdir('static' + caminhoImagem, { recursive: true })
                    .then(() => imagem.arrayBuffer())
                    .then((buffer) => fs.writeFile(`static/${caminhoImagem}/${nomeImagem}`, Buffer.from(buffer)))
                    .catch((erro) => console.error('Erro ao salvar imagem:', erro));
            }
        } catch (erro) {
            return fail(400, { erro: erro.message });
        }
    }
};
