<script>
	let { data, form } = $props();
</script>

<h1>Entrar/Cadastrar</h1>
<form method="post" action="?/login">
	<input type="hidden" name="redirectTo" value={data.redirectTo} />
	<label>
		Usuário
		<input name="username" />
	</label>
	<label>
		Senha
		<input type="password" name="password" />
	</label>
	<button>Entrar</button>
	<button formaction="?/register">Cadastrar</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
