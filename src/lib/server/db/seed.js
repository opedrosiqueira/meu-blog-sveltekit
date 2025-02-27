import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import * as tabela from './schema.js';

const cliente = createClient({ url: "file:local.db" });
export const db = drizzle(cliente);

async function popularBanco() {
    console.log('Populando o banco de dados...');

    await db.delete(tabela.user).where(eq(tabela.user.name, 'usuarioTeste'));

    await db.insert(tabela.user).values([
        { name: 'usuarioTeste', passwordHash: 'senhaHash' }
    ]);

    console.log('Banco de dados populado com sucesso.');
    process.exit(0);
}

popularBanco().catch((erro) => {
    console.error('Erro ao popular o banco de dados:', erro);
    process.exit(1);
});