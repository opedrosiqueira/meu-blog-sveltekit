import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export const load = async (event) => {
    const user = (await db.select().from(table.user).where(eq(table.user.id, event.locals.user.id)).limit(1)).at(0);
    return { user };
};

export const actions = {
    // parei aqui. mas como mudei a logica de autenticacao, antes preciso testa-la
    default: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        const redirectTo = formData.get('redirectTo') || '/';

        try {
            const user = await auth.authenticateUser(username, password);
            await auth.createSession(user.id, event.cookies)
        } catch (e) {
            return fail(400, { message: e.message });
        }

        return redirect(302, redirectTo);
    }
};
