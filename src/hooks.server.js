import * as auth from '$lib/server/auth.js';

/** Se um token de sessão estiver presente nos cookies da requisição, valide-o e defina o usuário e a sessão. */
export const handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (sessionToken) {
		const { session, user } = await auth.validateSessionToken(sessionToken, event.cookies);
		event.locals.user = user;
		event.locals.session = session;
	} else {
		event.locals.user = event.locals.session = null;
	}

	return resolve(event);
};