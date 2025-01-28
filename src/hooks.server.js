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
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) { // we recommend setting a new session cookie after validation to persist the cookie for an extended time.
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else { // if session is not valid, then both session and user are null, and I can delete the cookie
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = handleAuth;
