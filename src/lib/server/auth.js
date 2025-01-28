import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

/**
 * Generate a random string 
 * @returns {string}
 */
export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

/**
 * Create a new session with a user ID, a token and a expiration date. The token is hashed with SHA-256. The session is stored in the database and returned.
 * @param {string} token 
 * @param {number} userId 
 * @returns {Promise<Session>}
 */
export async function createSession(token, userId) {
	const byteToken = new TextEncoder().encode(token); // Convert token to bytes
	const sha256Token = sha256(byteToken); // SHA-256 hash of the token
	const sessionId = encodeHexLowerCase(sha256Token); // Hexadecimal representation of the hash

	const session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS)
	};
	await db.insert(table.session).values(session);
	return session;
}

/**
 * Sessions are validated in 2 steps: (1) Does the session exist in your database? (2) Is it still within expiration?
 * 
 * We'll also extend the session expiration when it's close to expiration. This ensures active sessions are persisted, while inactive ones will eventually expire.
 * 
 * For convenience, we'll return both the session and user object tied to the session ID.
 * 
 * @param {string} token hexadecimal representation of the SHA-256 hash of the session token
 * @returns {Promise<{session: Session|null, user: User|null}>} If the session is not found, both session and user will be null.
 */
export async function validateSessionToken(token) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: { id: table.user.id, username: table.user.username },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) return { session: null, user: null };

	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - DAY_IN_MS / 2) { // Extend session expiration if it's close to expiration
		session.expiresAt = new Date(Date.now() + DAY_IN_MS);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

/**
 * Invalidate a session by deleting it from the database.
 * @param {string} sessionId
 */
export async function invalidateSession(sessionId) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

/**
 * Set the session token cookie with the token and expiration date.
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @param {string} token
 * @param {Date} expiresAt
 */
export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

/**
 * Delete the session token cookie.
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
export function deleteSessionTokenCookie(event) {
	event.cookies.delete(sessionCookieName, { path: '/' });
}
