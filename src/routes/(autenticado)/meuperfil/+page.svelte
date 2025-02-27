<script>
	let { data, form } = $props();
</script>

<div class="mx-auto card my-3" style="max-width: 540px;">
	<div class="row g-0">
		<div class="col-md-4 text-center">
			<img src={data.user.image ?? '/person.svg'} class="img-fluid rounded-start" alt="foto do usuário" />
		</div>
		<div class="col-md-8">
			<div class="card-body">
				<form class="row g-3" method="post" enctype="multipart/form-data">
					<div class="col-md-6">
						<label>
							Nome do usuário
							<input class="form-control" name="nomeUsuario" value={data.user.name} />
						</label>
					</div>
					<div class="col-md-6">
						<label>
							Senha atual
							<input type="password" class="form-control" name="senha" required />
						</label>
					</div>
					<div class="col-md-6">
						<label>
							Nova senha
							<input type="password" class="form-control" name="senha1" />
						</label>
					</div>
					<div class="col-md-6">
						<label>
							Confirme a senha
							<input type="password" class="form-control" name="senha2" />
						</label>
					</div>
					<div class="col-12">
						<label>
							Foto de perfil
							<input class="form-control" type="file" name="imagem" accept="image/*" />
						</label>
					</div>
					<div class="col-12">
						<button class="btn btn-primary">Atualizar informações</button>
					</div>
					{#if form?.erro}
						<p class="text-danger">{form.erro}</p>
					{/if}
				</form>
			</div>
		</div>
	</div>
</div>
