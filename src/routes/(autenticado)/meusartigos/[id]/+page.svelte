<script>
	import { marked } from 'marked';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	if (!form && data.artigo) {
		form = {
			titulo: data.artigo.titulo,
			subtitulo: data.artigo.subtitulo,
			conteudo: data.artigo.conteudo
		};
	}

	function submeter({ action, cancel }) {
		if (action.search == '?/excluir' && !window.confirm('Tem certeza de que deseja excluir esta categoria?')) {
			cancel();
		}
	}
</script>

<h1>
	{#if !data.artigo}
		Novo artigo
	{:else}
		Editar artigo
	{/if}
</h1>

<form method="post" action="?/salvar" use:enhance={submeter}>
	<input type="hidden" name="id" value={data.artigo?.id ?? ''} />
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
	<div class="mb-3">
		<button class="btn btn-primary">Salvar</button>
		<button type="button" onclick={() => window.history.back()} class="btn btn-warning">Cancelar</button>
		{#if data.artigo}
			<button formaction="?/excluir" class="btn btn-danger">Excluir</button>
		{/if}
	</div>
	{#if form?.erro}
		<p class="alert alert-danger">{form.erro}</p>
	{/if}
</form>

<!-- <h1>{form?.titulo ?? ''}</h1> todolist enquanto usuário digita, mostra resultado
<p>{form?.subtitulo ?? ''}</p>

{@html marked(form?.conteudo ?? '')} -->
