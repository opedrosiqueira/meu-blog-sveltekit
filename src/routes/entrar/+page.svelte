<script>
	let { data, form } = $props();
</script>

<h1>Entrar / Cadastrar</h1>

<form method="post" action="?/login" class="form">
	<input type="hidden" name="redirectTo" value={data.redirectTo} />

	<div class="mb-3">
		<label>
			Usuário <input name="username" required class="form-control" />
		</label>
	</div>

	<div class="mb-3">
		<label>
			Senha <input type="password" name="password" required class="form-control" />
		</label>
	</div>

	<div class="d-flex gap-2">
		<button class="btn btn-primary">Entrar</button>
		<button class="btn btn-secondary" formaction="?/register">Cadastrar</button>
	</div>
</form>

{#if form?.message}
	<p class="alert alert-danger mt-3" role="alert">{form.message}</p>
{/if}
