import * as auth from '$lib/server/auth.js';

/**
 * If a session token is present in the request cookies, validate it and set the user and session locals.
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @param {Function} resolve
 * @returns {Promise<import('@sveltejs/kit').RequestEvent>}
 */
const handleAuth = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken, event.cookies);

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = handleAuth;
