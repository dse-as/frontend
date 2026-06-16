<script lang="ts">
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import './layout.css';

	import favicon from '$lib/assets/favicon.svg';
	import Nav from './Nav.svelte';
	import { asset } from '$app/paths';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex flex-col">
	<Nav />
</div>

<div class="min-h-screen pt-10 pb-20">{@render children()}</div>

<footer
	class="flex min-h-30 flex-col items-center justify-center gap-5 bg-dark-10 p-20 text-foreground-contrast"
>
	<p class="mb-5">Diese Webseite befindet sich in einer Alpha-Version.</p>
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
			<img class="h-16 object-contain" src={asset('/logos/logo-snf.png')} alt="logo" />
			<img class="h-16 object-contain" src={asset('/')} alt="logo" />
		</a>

		<a href="https://www.ds.uzh.ch">
			<img class="h-16 object-contain" src={asset('/logos/logo-uzh.png')} alt="logo" />
		</a>
		<a href="https://www.unige.ch/lettres/alman/">
			<img class="h-16 object-contain" src={asset('/logos/logo-unige.gif')} alt="logo" />
		</a>
		<a href="https://dh.unibe.ch">
			<img
				class="h-16 object-contain"
				width="100px;"
				src={asset('/logos/logo-uzh.png')}
				alt="logo"
			/>
		</a>
		<a href="https://dsl.unibe.ch">
			<img
				class="h-16 object-contain"
				width="100px;"
				src={asset('/logos/logo-dsl.png')}
				alt="logo"
			/>
		</a>
	</div>
</footer>
