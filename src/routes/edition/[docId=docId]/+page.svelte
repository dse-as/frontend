<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	let { data } = $props();
	console.log(data.meta[page.params.docId]);
	console.log(data.meta[page.params.docId].units.unitIds[0]);

	//! @sebi: why does it not work with redirect?

	onMount(() => {
		// redirect(302, `${page.url.pathname}/text`);
		goto(`${page.url.pathname}/${data.meta[page.params.docId].units.unitIds[0]}`);
	});
</script>
