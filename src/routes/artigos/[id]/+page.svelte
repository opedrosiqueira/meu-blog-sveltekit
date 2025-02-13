<script>
	import { marked } from 'marked';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.artigo.titulo}</title>
</svelte:head>

<h1>{data.artigo.titulo}</h1>
{#if data.artigo.autorId == data.user?.id}
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

<hr />

<h5>Comentários</h5>
<!-- todo-list -->
<!-- <form method="post" action="/comentar/{data.artigo.id}">
	<div class="form-floating mb-3">
		<textarea class="form-control" id="comentario" name="comentario" placeholder="Comentário"></textarea>
		<label for="comentario">Comentário</label>
	</div>
	<button type="submit" class="btn btn-primary">Comentar</button>
</form> -->
<div class="list-group">
	<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
		<img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0" />
		<div class="d-flex gap-2 w-100 justify-content-between">
			<div>
				<h6 class="mb-0">List group item heading</h6>
				<p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
			</div>
			<small class="opacity-50 text-nowrap">now</small>
		</div>
	</a>
	<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
		<img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0" />
		<div class="d-flex gap-2 w-100 justify-content-between">
			<div>
				<h6 class="mb-0">Another title here</h6>
				<p class="mb-0 opacity-75">Some placeholder content in a paragraph that goes a little longer so it wraps to a new line.</p>
			</div>
			<small class="opacity-50 text-nowrap">3d</small>
		</div>
	</a>
	<a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
		<img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0" />
		<div class="d-flex gap-2 w-100 justify-content-between">
			<div>
				<h6 class="mb-0">Third heading</h6>
				<p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
			</div>
			<small class="opacity-50 text-nowrap">1w</small>
		</div>
	</a>
</div>
