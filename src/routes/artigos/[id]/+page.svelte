<script>
	import { marked } from 'marked';

	let { data, form } = $props();
	let textarea = $state();
	let comentario = $state('');

	$inspect(comentario).with(() => {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		}
	});

	function limparComentario() {
		comentario = '';
	}
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

{#if data.user}
	<form method="post" action="?/comentar">
		<input type="hidden" name="artigoId" value={data.artigo.id} />
		<input type="hidden" name="autorId" value={data.user.id} />

		<div class="row mb-3">
			<div class="col">
				<textarea class="form-control" name="conteudo" placeholder="Adicione um comentário" minlength="2" maxlength="512" rows="1" bind:this={textarea} bind:value={comentario}></textarea>
			</div>
			<div class="col-auto">
				<button type="submit" class="btn btn-primary" disabled={!comentario.trim()}>Comentar</button>
				<button type="button" class="btn border" onclick={limparComentario}>Cancelar</button>
			</div>
		</div>
	</form>
{:else}
	<p><a href="/entrar">Entre</a> para comentar.</p>
{/if}

{#if form?.erro}
	<p class="alert alert-danger">{form.erro}</p>
{/if}

{#if data.comentarios?.length}
	<div class="list-group list-group-flush">
		{#each data.comentarios as comentario}
			<div class="list-group-item list-group-item-action d-flex gap-3 pt-3">
				<img src={comentario.autorImagem || 'https://github.com/twbs.png'} alt={comentario.autor} width="32" height="32" class="rounded-circle flex-shrink-0" />
				<div class="d-flex gap-2 w-100 justify-content-between">
					<div>
						<h6 class="mb-0">{comentario.autor}</h6>
						<div class="mb-0 opacity-75">{@html marked(comentario.conteudo)}</div>
					</div>
					<small class="opacity-50 text-nowrap">{comentario.criadoEm}</small>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p>Nenhum comentário...</p>
{/if}
