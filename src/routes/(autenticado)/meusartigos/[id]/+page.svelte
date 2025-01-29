<script>
	import { page } from '$app/state';

	let { data, form } = $props();
</script>

<h1>
	{#if page.params.id === 'novo'}
		Novo artigo
	{:else}
		Editar artigo
	{/if}
</h1>

<form >
	<div class="mb-3">
		<label for="titulo" class="form-label">Título</label>
		<input type="text" class="form-control" id="titulo" bind:value={form.titulo} />
	</div>
	<div class="mb-3">
		<label for="subtitulo" class="form-label">Subtítulo</label>
		<input type="text" class="form-control" id="subtitulo" bind:value={form.subtitulo} />
	</div>
	<div class="mb-3">
		<label for="conteudo" class="form-label">Conteúdo</label>
		<textarea class="form-control" id="conteudo" rows="10" bind:value={form.conteudo}></textarea>
	</div>
	<button type="submit" class="btn btn-primary">Salvar</button>
</form>
