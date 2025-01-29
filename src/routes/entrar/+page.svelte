<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<h1>Entrar/Cadastrar</h1>
<form method="post" action="?/login" use:enhance>
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
