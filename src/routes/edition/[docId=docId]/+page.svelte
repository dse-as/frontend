<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	let { data } = $props();

	onMount(() => {
		//! @sebi: why does it not work with redirect?
		// redirect(302, `${page.url.pathname}/text`);
		goto(`${page.url.pathname}/${data.meta[page.params.docId].units.unitIds[0]}`);
	});
</script>
