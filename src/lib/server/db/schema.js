import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, check } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull().unique(),
	image: text(),
	passwordHash: text().notNull()
});

export const session = sqliteTable('session', {
	id: text().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull()
});

export const artigo = sqliteTable('artigo', {
	id: integer().primaryKey({ autoIncrement: true }),
	titulo: text().notNull(),
	subtitulo: text().notNull(),
	conteudo: text().notNull(),
	autorId: integer().notNull().references(() => user.id),
	atualizadoEm: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
	criadoEm: text().notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const comentario = sqliteTable('comentario', {
	id: integer().primaryKey({ autoIncrement: true }),
	artigoId: integer().notNull().references(() => artigo.id),
	autorId: integer().notNull().references(() => user.id),
	conteudo: text().notNull(),
	criadoEm: text().notNull().default(sql`(CURRENT_TIMESTAMP)`)
},
	(table) => [
		check("restricao_conteudo", sql`LENGTH(${table.conteudo}) BETWEEN 2 AND 512`)
	]
);