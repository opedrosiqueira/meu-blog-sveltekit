import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const load = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return { redirectTo: event.request.headers.get('referer') || '/' };
};

export const actions = {
	login: async (event) => {
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
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		try {
			const user = await auth.registerUser(username, password);
			await auth.createSession(user.id, event.cookies);
		} catch (e) {
			return fail(400, { message: e.message });
		}

		return redirect(302, '/entrar');
	}
};
