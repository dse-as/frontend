<script lang="ts">
	import './layout.css';
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

<div
	data-dom="footer"
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
			<img
				class="h-16 object-contain"
				src="https://upload.wikimedia.org/wikipedia/commons/7/7d/SNF_logo_Swiss_National_Science_Foundation.png"
			/>
		</a>

		<a href="https://www.ds.uzh.ch">
			<img
				class="h-16 object-contain"
				src="https://www.cd.uzh.ch/dam/jcr:c2f7701e-f4b6-4d91-ab93-85853a133f29/uzh-logo-black.png"
			/>
		</a>
		<a href="https://www.unige.ch/lettres/alman/index.php?cID=658">
			<img
				class="h-16 object-contain"
				src="http://www.unige.ch/presse/charte/logos_jpg/logo_nb70.jpg"
			/>
		</a>
		<a href="https://dh.unibe.ch">
			<img
				class="h-16 object-contain"
				width="100px;"
				src="https://www.jobs.apps.be.ch/directlink/1005086002/assets/images/logo_unibern.png"
			/>
		</a>
		<a href="https://dsl.unibe.ch">
			<img
				class="h-16 object-contain"
				width="100px;"
				src="https://avatars.githubusercontent.com/u/130562494?s=200&v=4"
			/>
		</a>
	</div>
</div>
