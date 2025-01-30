<script>
	import { marked } from 'marked';

	let { data } = $props();
</script>

<h1>{data.artigo.titulo}</h1>
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
