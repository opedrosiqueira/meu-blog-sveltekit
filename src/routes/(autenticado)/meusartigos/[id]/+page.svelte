<script>
	import { marked } from 'marked';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let conteudo = $state(form?.conteudo ?? data?.artigo?.conteudo ?? '');

	if (!form && data.artigo) {
		form = {
			titulo: data.artigo.titulo,
			subtitulo: data.artigo.subtitulo,
			conteudo: data.artigo.conteudo
		};
	}

	function submeter({ action, cancel }) {
		if (action.search == '?/excluir' && !window.confirm('Tem certeza de que deseja excluir este artigo?')) {
			cancel();
		}
	}
</script>

<h1>{data.artigo ? 'Editar artigo' : 'Novo artigo'}</h1>

<form method="post" action="?/salvar" use:enhance={submeter}>
	<input type="hidden" name="id" value={data.artigo?.id ?? ''} />
	<div class="mb-3">
		<label class="d-block">
			Título
			<input type="text" class="form-control" name="titulo" value={form?.titulo ?? ''} required />
		</label>
	</div>
	<div class="mb-3">
		<label class="d-block">
			Subtítulo
			<input type="text" class="form-control" name="subtitulo" value={form?.subtitulo ?? ''} required />
		</label>
	</div>
	<div class="mb-3 row">
		<div class="col">
			<label class="d-block">
				Conteúdo (aceita markdown)
				<hr />
				<textarea class="form-control" name="conteudo" rows="10" required bind:value={conteudo}></textarea>
			</label>
		</div>
		<div class="col">
			Prévia
			<hr />
			{@html marked(conteudo)}
		</div>
	</div>
	<div class="mb-3">
		<button class="btn btn-primary">Salvar</button>
		<button type="button" class="btn btn-warning" onclick={() => window.history.back()}>Cancelar</button>
		{#if data.artigo}
			<button formaction="?/excluir" class="btn btn-danger">Excluir</button>
		{/if}
	</div>

	{#if form?.erro}
		<p class="alert alert-danger">{form.erro}</p>
	{/if}
</form>
