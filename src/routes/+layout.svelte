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
            <span class="navbar-text">
                Navbar text with an inline element
            </span>
        </div>
    </header>
</div>

<div class="container mt-3">
    <div class="row">
        <div class="col-lg-2">
            <aside>
                <div class="offcanvas-lg offcanvas-start" tabindex="-1" id="mySideBar">
                    <div class="offcanvas-header border-bottom">
                        <h5 class="offcanvas-title">Browse docs</h5>
                        <button class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#mySideBar"></button>
                    </div>
                    <div class="offcanvas-body">
                        <nav class="w-100">
                            <ul class="list-unstyled mb-0 pb-3 pb-md-2 pe-lg-2">
                                <li class="py-2">Um link qualquer</li>
                                <li class="py-2">Um link qualquer</li>
                                <li class="py-2">Um link qualquer</li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>
        </div>
        <div class="col-lg">
            <main>
                {@render children()}
            </main>
        </div>
    </div>
</div>

<div class="container-fluid">
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
        <div class="col-md-4 d-flex align-items-center">
            <a href="/" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"><i class="bi bi-bootstrap-fill"></i></a>
            <span class="mb-3 mb-md-0 text-body-secondary">© 2024 Company, Inc</span>
        </div>
        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li class="ms-3"><a class="text-body-secondary" href="#"><i class="bi bi-facebook"></i></a></li>
            <li class="ms-3"><a class="text-body-secondary" href="#"><i class="bi bi-whatsapp"></i></a></li>
            <li class="ms-3"><a class="text-body-secondary" href="#"><i class="bi bi-twitter"></i></a></li>
        </ul>
    </footer>
</div>
