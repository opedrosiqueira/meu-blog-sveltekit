## Criação do projeto

Execute:

```
pnpm dlx sv create meu-blog-sveltekit
```

Selecione as opções:

```
┌  Welcome to the Svelte CLI! (v0.6.13)
│
◇  Which template would you like?
│  SvelteKit minimal
│
◇  Add type checking with Typescript?
│  No
│
◆  Project created
│
◇  What would you like to add to your project? (use arrow keys / space bar)
│  prettier, eslint, drizzle, lucia
│
◇  drizzle: Which database would you like to use?
│  SQLite
│
◇  drizzle: Which SQLite client would you like to use?
│  libSQL
│
◇  lucia: Do you want to include a demo? (includes a login/register page)
│  Yes
│
◇  Which package manager do you want to install dependencies with?
│  pnpm
```

Execute:

```
cd meu-blog-sveltekit
pnpm db:push
```

Selecione "Yes".

Tudo pronto! Pode executar o site com `pnpm dev` e acessar a página http://localhost:5173/ de exemplo!

## TODO-List

em vez de mostrar a data, mostrar um período de tempo desde a data inicial, e.g., há x dias.