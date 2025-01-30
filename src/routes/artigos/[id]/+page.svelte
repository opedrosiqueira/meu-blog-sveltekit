<script>
	import { marked } from 'marked';

	let { data } = $props();
</script>
<svelte:head>
	<title>{data.artigo.titulo}</title>
</svelte:head>

<h1>{data.artigo.titulo}</h1>
{#if data.artigo.autorId == data.user.id}
	<a href="/meusartigos/{data.artigo.id}" class="btn btn-primary">Editar</a>
{/if}
<p class="text-secondary">
	<small>
		Publicado em {data.artigo.criadoEm}, por {data.artigo.autor}.
		{#if data.artigo.atualizadoEm !== data.artigo.criadoEm}
			Atualizado em {data.artigo.atualizadoEm}.
		{/if}
	</small>
</p>
<p>{data.artigo.subtitulo}</p>
<hr />
{@html marked(data.artigo.conteudo)}
