<script lang="ts">
	import './layout.css';
	import '$lib/CETEIcean/CETEIcean-default.css';
	import '$lib/CETEIcean/CETEIcean-custom.css';
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from './Nav.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex flex-col">
	<Nav />
</div>

{@render children()}

<footer
	class="flex min-h-30 flex-col items-center justify-center gap-5 bg-surface-100 p-20 text-surface-500"
>
	<p class="mb-5">Diese Webseite befindet sich in einer Beta-Version</p>
	<p>
		<a
			class=" underline"
			href="https://annemarie-schwarzenbach.ch/"
			target="blank"
			rel="noopener noreferrer">annemarie-schwarzenbach.ch/</a
		>
	</p>

	<p>
		Technischer Kontakt:
		<a
			class=" underline"
			href="mailto:tech@annemarie-schwarzenbach.ch"
			target="blank"
			rel="noopener noreferrer">tech@annemarie-schwarzenbach.ch/</a
		>
	</p>
	<div class="mt-10 flex w-full justify-around gap-10">
		<a href="https://data.snf.ch/grants/grant/10000500">
			<img class="h-16 object-contain" src="/logos/logo-snf.png" />
		</a>

		<a href="https://www.ds.uzh.ch">
			<img class="h-16 object-contain" src="/logos/logo-uzh.png" />
		</a>
		<a href="https://www.unige.ch/lettres/alman/">
			<img class="h-16 object-contain" src="/logos/logo-unige.gif" />
		</a>
		<a href="https://dh.unibe.ch">
			<img class="h-16 object-contain" width="100px;" src="/logos/logo-uzh.png" />
		</a>
		<a href="https://dsl.unibe.ch">
			<img class="h-16 object-contain" width="100px;" src="/logos/logo-dsl.png" />
		</a>
	</div>
</footer>

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global(*:focus) {
		@apply ring-2 ring-secondary-200;
		outline: none; /* Overwrite default focus-marker */
	}
</style>
