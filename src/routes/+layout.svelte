<script>
	let { children } = $props();
</script>

<div class="container-fluid">
	<header class="navbar navbar-expand-lg bg-body-tertiary">
		<button class="navbar-toggler d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#mySideBar">
			<i class="bi bi-list"></i>
		</button>
		<a class="navbar-brand" href="#">Navbar w/ text</a>
		<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarText">
			<i class="bi bi-three-dots-vertical"></i>
		</button>
		<div class="collapse navbar-collapse" id="navbarText">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<a class="nav-link active" href="#">Home</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">Features</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">Pricing</a>
				</li>
			</ul>
			<span class="navbar-text"> Navbar text with an inline element </span>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="d-flex justify-content-between align-items-center pt-3 mt-4 border-top">
		<p class="mb-0 text-body-secondary">&copy; 2024 Company, Inc</p>

		<a href="/"> <img src="/favicon.png" alt="logo" style="height: 2em" /> </a>

		<ul class="nav">
			<li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary"><i class="bi bi-facebook"></i></a></li>
			<li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary"><i class="bi bi-whatsapp"></i></a></li>
			<li class="nav-item"><a href="#" class="nav-link px-2 text-body-secondary"><i class="bi bi-twitter"></i></a></li>
		</ul>
	</footer>
</div>
