import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import * as tabela from './schema.js';

const cliente = createClient({ url: "file:local.db" });
export const db = drizzle(cliente);

async function popularBanco() {
    console.log('Populando o banco de dados...');

    await db.delete(tabela.usuario).where(eq(tabela.usuario.nome, 'usuarioTeste'));

    await db.insert(tabela.usuario).values([
        { nome: 'usuarioTeste', hashSenha: 'senhaHash' }
    ]);

    console.log('Banco de dados populado com sucesso.');
    process.exit(0);
}

popularBanco().catch((erro) => {
    console.error('Erro ao popular o banco de dados:', erro);
    process.exit(1);
});