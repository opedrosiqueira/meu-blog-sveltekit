<script>
	let { children, data } = $props();
</script>

<div class="row mt-4">
	<div class="col-lg-2 border-end bg-body-tertiary">
		<aside>
			<div class="offcanvas-lg offcanvas-start" tabindex="-1" id="mySideBar">
				<div class="offcanvas-header border-bottom">
					<h5 class="offcanvas-title">Menu</h5>
					<button class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#mySideBar" aria-label="fecharSidebar"></button>
				</div>
				<div class="offcanvas-body">
					<ul class="nav nav-pills flex-column mb-auto">
						<li><a href="/meuperfil" class="nav-link link-body-emphasis">Meu perfil</a></li>
						<li><a href="/meusartigos" class="nav-link link-body-emphasis">Meus artigos</a></li>
						<li><a href="#" class="nav-link link-body-emphasis">Meus comentários</a></li>
						<li><a href="#" class="nav-link link-body-emphasis">Minhas curtidas</a></li>
					</ul>
				</div>
			</div>
		</aside>
	</div>
	<div class="col-lg">
		{@render children()}
	</div>
</div>
