<script>
	let { user } = $props();
</script>

<header class="navbar navbar-expand-lg bg-body-tertiary">
	<button class="navbar-toggler d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#mySideBar" aria-label="toggleSidebar">
		<i class="bi bi-list"></i>
	</button>
	<a class="navbar-brand" href="/">Meu Blog</a>
	<button class="navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#navbarText" aria-label="toggleNavbar">
		<i class="bi bi-three-dots-vertical"></i>
	</button>
	<div class="offcanvas offcanvas-end" tabindex="-1" id="navbarText">
		<div class="offcanvas-header">
			<h5 class="offcanvas-title">Menu</h5>
			<button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body">
			<ul class="navbar-nav me-auto">
				<li class="nav-item">
					<a class="nav-link active" href="/">Home</a>
				</li>
				<li class="nav-item">
					<a class="nav-link active" href="/teste">Teste</a>
				</li>
				<li class="nav-item">
					<a class="nav-link active" href="/secreta">Somente usuários</a>
				</li>
			</ul>
			<!-- https://getbootstrap.com/docs/5.3/examples/headers/ -->
			<div class="dropdown">
				<button class="btn d-block dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
					{#if user}
						<img src={user.image || 'https://github.com/twbs.png'} alt="foto do usuário" width="32" height="32" class="rounded-circle" />
					{:else}
						Entrar
					{/if}
				</button>
				<ul class="dropdown-menu dropdown-menu-end">
					{#if user}
						<li><a class="dropdown-item" href="/meuperfil">{user.name}</a></li>
						<li><hr class="dropdown-divider" /></li>
						<li>
							<form method="post" action="/sair">
								<button class="dropdown-item">Sair</button>
							</form>
						</li>
					{:else}
						<!-- https://getbootstrap.com/docs/5.3/components/dropdowns/ -->
						<form class="p-3" method="post" action="/entrar?/login">
							<!-- https://getbootstrap.com/docs/5.3/forms/floating-labels/#example -->
							<div class="form-floating mb-3">
								<input class="form-control" id="username" name="username" placeholder="Nome de usuário" />
								<label for="username">Nome de usuário</label>
							</div>
							<div class="form-floating mb-3">
								<input type="password" class="form-control" id="floatingSenha" name="password" placeholder="Senha" />
								<label for="floatingSenha">Senha</label>
							</div>
							<button type="submit" class="btn btn-primary">Entrar</button>
						</form>
						<div class="dropdown-divider"></div>
						<a class="dropdown-item" href="/entrar">Novo aqui? Criar conta!</a>
						<a class="dropdown-item" href="#">Esqueceu senha?</a>
					{/if}
				</ul>
			</div>
		</div>
	</div>
</header>
