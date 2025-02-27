<script>
	let { data, form } = $props();
	let termo = $state('');
	let filtrados = $derived(termo.trim() ? data.artigos.filter((artigo) => artigo.titulo.toLowerCase().includes(termo.toLowerCase())) : data.artigos.slice());
</script>

<h1>Meus artigos</h1>

<a href="/meusartigos/novo" class="btn btn-primary mb-3">Novo artigo</a>

{#if data.artigos?.length === 0}
	<p>Você ainda não escreveu nenhum artigo.</p>
{:else}
	<input class="form-control mb-3" type="text" bind:value={termo} placeholder="Pesquisar artigos" />

	{#if filtrados.length === 0}
		<p>Nenhum artigo encontrado.</p>
	{:else}
		<div class="list-group">
			{#each filtrados as artigo}
				<a href="/meusartigos/{artigo.id}" class="list-group-item list-group-item-action">
					<div class="d-flex w-100 justify-content-between">
						<h5 class="mb-1">{artigo.titulo}</h5>
						<small class="text-body-secondary">{artigo.atualizadoEm}</small>
					</div>
					<p class="mb-1">{artigo.subtitulo}</p>
				</a>
			{/each}
		</div>
	{/if}
{/if}
