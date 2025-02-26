import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';

export const load = async (event) => {
    const [user] = await db.select().from(table.user).where(eq(table.user.id, event.locals.user.id)).limit(1);
    return { user };
};

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('nomeUsuario');
        const password = formData.get('senha');
        const senha1 = formData.get('senha1');
        const senha2 = formData.get('senha2');
        const imagem = formData.get('imagem');

        if (senha1 !== senha2) {
            return fail(400, { message: 'As senhas não conferem' });
        }

        try {
            await auth.authenticateUser(event.locals.user.username, password);

            if (senha1) await auth.updatePassword(event.locals.user.id, senha1);

            if (username && username != event.locals.user.username) {
                await db.update(table.user).set({ username }).where(eq(table.user.id, event.locals.user.id));
                event.locals.user.username = username;
            }

            if (imagem && imagem.size) {
                const image = `/banco/usuario/imagem/user-${event.locals.user.id}`;
                await db.update(table.user).set({ image }).where(eq(table.user.id, event.locals.user.id));
                await fs.writeFile('static' + image, Buffer.from(await imagem.arrayBuffer()));
            }
        } catch (e) {
            return fail(400, { message: e.message });
        }
    }
};
