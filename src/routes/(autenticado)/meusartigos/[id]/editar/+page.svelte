<script>
	import { page } from '$app/state';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<h1>
	{#if page.params.id === 'novo'}
		Novo artigo
	{:else}
		Editar artigo
	{/if}
</h1>

<form method="post" action="?/criar" use:enhance>
	<div class="mb-3">
		<label class="d-block">
			Título
			<input type="text" class="form-control" name="titulo" value={form?.titulo ?? ''} />
		</label>
	</div>
	<div class="mb-3">
		<label class="d-block">
			Subtítulo
			<input type="text" class="form-control" name="subtitulo" value={form?.subtitulo ?? ''} />
		</label>
	</div>
	<div class="mb-3">
		<label class="d-block">
			Conteúdo (aceita markdown)
			<textarea class="form-control" name="conteudo" value={form?.conteudo ?? ''} rows="10"></textarea>
		</label>
	</div>
	<button type="submit" class="btn btn-primary">Salvar</button>
</form>
{#if form?.erro}
	<p class="alert alert-danger">{form.erro}</p>
{/if}
