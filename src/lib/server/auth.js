import { hash, verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

/** Generate a random base64 URL-encoded string */
function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

/** Hash a token using SHA-256 and return its hexadecimal representation */
function hashToken(token) {
	const byteToken = new TextEncoder().encode(token); // Convert token to bytes
	const sha256Token = sha256(byteToken); // SHA-256 hash of the token (a byte array)
	const hexToken = encodeHexLowerCase(sha256Token); // Hexadecimal representation of the hash
	return hexToken;
}

/**
 * Create a new session for a user, store it in the database, and optionally set the cookie if passed as argument.
 */
export async function createSession(userId, cookies) {
	const token = generateSessionToken();
	const id = hashToken(token);
	const expiresAt = new Date(Date.now() + DAY_IN_MS);
	const session = { id, userId, expiresAt };

	await db.insert(table.session).values(session);
	if (cookies) setSessionTokenCookie(cookies, token, expiresAt);

	return session;
}

/**
 * Validate a session token by checking its existence and expiration. If valid, return both the session and user object tied to the session ID. Extend session expiration if it's close to expiration. Optionally set the cookie if passed as argument.
 */
export async function validateSessionToken(token, cookies) {
	const sessionId = hashToken(token);
	const [result] = await db
		.select({ user: { id: table.user.id, username: table.user.username, image: table.user.image }, session: table.session })
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) return { session: null, user: null };

	const { session, user } = result;
	const now = Date.now();

	if (now >= session.expiresAt.getTime()) {
		await invalidateSession(session.id, cookies);
		return { session: null, user: null };
	}

	if (now >= session.expiresAt.getTime() - DAY_IN_MS / 2) {
		session.expiresAt = new Date(now + DAY_IN_MS);
		await db.update(table.session).set({ expiresAt: session.expiresAt }).where(eq(table.session.id, session.id));
	}

	if (cookies) setSessionTokenCookie(cookies, token, session.expiresAt); // we recommend setting a new session cookie after validation to persist the cookie for an extended time.
	else deleteSessionTokenCookie(cookies); // if session is not valid, then both session and user are null, and we can delete the cookie

	return { session, user };
}

/** Invalidate a session by deleting it from the database and removing the cookie if it's not null. */
export async function invalidateSession(sessionId, cookies) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
	if (cookies) deleteSessionTokenCookie(cookies);
}

/** Set session token cookie */
export function setSessionTokenCookie(cookies, token, expiresAt) {
	cookies.set(sessionCookieName, token, { expires: expiresAt, path: '/' });
}

/** Delete session token cookie */
export function deleteSessionTokenCookie(cookies) {
	cookies.delete(sessionCookieName, { path: '/' });
}

/** Validate username format */
function validateUsername(username) {
	return typeof username === 'string' && username.length >= 3 && username.length <= 31 && /^[a-z0-9_-]+$/.test(username);
}

/** Validate password format */
function validatePassword(password) {
	return typeof password === 'string' && password.length >= 4 && password.length <= 255;
}

/** Authenticate a user by verifying the password */
export async function authenticateUser(username, password) {
	if (!validateUsername(username) || !validatePassword(password)) throw new Error('Invalid username or password');

	const [existingUser] = await db.select().from(table.user).where(eq(table.user.username, username));
	if (!existingUser) throw new Error('Incorrect username or password');

	const validPassword = await verify(existingUser.passwordHash, password, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 }); // recommended minimum parameters
	if (!validPassword) throw new Error('Incorrect username or password');

	return existingUser;
}

/** Register a new user with a hashed password */
export async function registerUser(username, password) {
	if (!validateUsername(username) || !validatePassword(password)) throw new Error('Invalid username or password');

	const passwordHash = await hash(password, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 }); // recommended minimum parameters
	const [newUser] = await db.insert(table.user).values({ username, passwordHash }).returning();
	return newUser;
}

/** Update user password */
export async function updatePassword(userId, newPassword) {
	const passwordHash = await hash(newPassword, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 }); // recommended minimum parameters
	await db.update(table.user).set({ passwordHash }).where(eq(table.user.id, userId));
}
