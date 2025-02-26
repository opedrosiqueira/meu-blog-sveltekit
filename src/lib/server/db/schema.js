import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, check } from 'drizzle-orm/sqlite-core';

export const usuario = sqliteTable('usuario', {
	id: integer().primaryKey({ autoIncrement: true }),
	nome: text().notNull().unique(),
	imagem: text(),
	hashSenha: text().notNull()
});

export const sessao = sqliteTable('sessao', {
	id: text().primaryKey(),
	usuarioId: integer()
		.notNull()
		.references(() => usuario.id),
	expiraEm: integer('expiraEm', { mode: 'timestamp' }).notNull()
});

export const artigo = sqliteTable('artigo', {
	id: integer().primaryKey({ autoIncrement: true }),
	titulo: text().notNull(),
	subtitulo: text().notNull(),
	conteudo: text().notNull(),
	autorId: integer().notNull().references(() => usuario.id),
	atualizadoEm: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
	criadoEm: text().notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const comentario = sqliteTable('comentario', {
	id: integer().primaryKey({ autoIncrement: true }),
	artigoId: integer().notNull().references(() => artigo.id),
	autorId: integer().notNull().references(() => usuario.id),
	conteudo: text().notNull(),
	criadoEm: text().notNull().default(sql`(CURRENT_TIMESTAMP)`)
},
	(table) => [
		check("restricao_conteudo", sql`LENGTH(${table.conteudo}) BETWEEN 2 AND 512`)
	]
);