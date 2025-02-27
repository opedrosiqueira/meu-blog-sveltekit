<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children, data } = $props();
</script>

<div class="d-flex flex-column min-vh-100 container-fluid">
	<Header user={data.user} />

	<main>{@render children()}</main>

	<Footer />
</div>
