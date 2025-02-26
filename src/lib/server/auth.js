import { hash, verify } from '@node-rs/argon2';
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
 * Create a new session with a user ID, a token and a expiration date. The token is then hashed with SHA-256, the session is stored in the database and returned.
 * @param {string} token 
 * @param {number} userId 
 * @returns {Promise<Session>}
 */
export async function createSession(userId, cookies) {
	const token = generateSessionToken();

	const byteToken = new TextEncoder().encode(token); // Convert token to bytes
	const sha256Token = sha256(byteToken); // SHA-256 hash of the token (a byte array)
	const sessionId = encodeHexLowerCase(sha256Token); // Hexadecimal representation of the hash (a string)

	const session = { id: sessionId, userId, expiresAt: new Date(Date.now() + DAY_IN_MS) };
	await db.insert(table.session).values(session);

	if (cookies) { setSessionTokenCookie(cookies, token, session.expiresAt); }

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
export async function validateSessionToken(token, cookies) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: { id: table.user.id, username: table.user.username, image: table.user.image },
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

	if (cookies) { // we recommend setting a new session cookie after validation to persist the cookie for an extended time.
		setSessionTokenCookie(cookies, token, session.expiresAt);
	} else { // if session is not valid, then both session and user are null, and I can delete the cookie
		deleteSessionTokenCookie(cookies);
	}

	return { session, user };
}

/**
 * Invalidate a session by deleting it from the database.
 * @param {string} sessionId
 */
export async function invalidateSession(sessionId, cookies) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));

	if (cookies) { deleteSessionTokenCookie(cookies); }
}

/**
 * Set the session token cookie with the token and expiration date.
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @param {string} token
 * @param {Date} expiresAt
 */
export function setSessionTokenCookie(cookies, token, expiresAt) {
	cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

/**
 * Delete the session token cookie.
 * @param {import("@sveltejs/kit").RequestEvent} event
 */
export function deleteSessionTokenCookie(cookies) {
	cookies.delete(sessionCookieName, { path: '/' });
}

function validateUsername(username) {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password) {
	return typeof password === 'string' && password.length >= 4 && password.length <= 255;
}

export async function authenticateUser(username, password) {
	if (!validateUsername(username)) { throw new Error('Invalid username'); }
	if (!validatePassword(password)) { throw new Error('Invalid password'); }

	const [existingUser] = await db.select().from(table.user).where(eq(table.user.username, username));
	if (!existingUser) { throw new Error('Incorrect username or password'); }

	const validPassword = await verify(existingUser.passwordHash, password, { // recommended minimum parameters
		memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1
	});
	if (!validPassword) { throw new Error('Incorrect username or password'); }

	return existingUser;
}

export async function registerUser(username, password) {
	if (!validateUsername(username)) { throw new Error('Invalid username'); }
	if (!validatePassword(password)) { throw new Error('Invalid password'); }

	const passwordHash = await hash(password, { // recommended minimum parameters
		memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1
	});

	const [newUser] = await db.insert(table.user).values({ username, passwordHash }).returning();
	return newUser;
}

export async function updatePassword(userId, newPassword) {
	const passwordHash = await hash(newPassword, { // recommended minimum parameters
		memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1
	});
	await db.update(table.user).set({ passwordHash }).where(eq(table.user.id, userId));
}
