<script>
	let { data, form } = $props();

	let termo = $state('');
	let filtrados = $state(data.artigos.slice());

	function pesquisar() {
		if (termo.trim() === '') {
			filtrados = data.artigos.slice();
			return;
		} else {
			filtrados = [];
			for (const artigo of data.artigos) {
				if (artigo.titulo.toLowerCase().includes(termo.toLowerCase())) {
					filtrados.push(artigo);
				}
			}
		}
	}
</script>

<!-- opção 1 para importar aquivo css -->
<svelte:head>
	<title>Meu Blog</title>
	<link rel="stylesheet" href="/style.css" />
</svelte:head>

<!-- opção 2 para importar aquivo css -->
<!-- <style>
	@import '/style.css';
</style> -->

<h1>Todos os artigos</h1>

<input class="form-control mb-3" type="text" bind:value={termo} oninput={pesquisar} placeholder="Pesquisar artigos" />
{#if filtrados.length === 0}
	<p>Nenhum artigo encontrado.</p>
{:else}
	<div class="list-group">
		{#each filtrados as artigo}
			<a href="/artigos/{artigo.id}" class="list-group-item list-group-item-action">
				<div class="d-flex w-100 justify-content-between">
					<h5 class="mb-1">{artigo.titulo}</h5>
					<small class="text-body-secondary">{artigo.atualizadoEm}</small>
				</div>
				<p class="mb-1">{artigo.subtitulo}</p>
			</a>
		{/each}
	</div>
{/if}
