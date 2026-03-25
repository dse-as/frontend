<script lang="ts">
	import { createAnnotationStore } from './store.svelte.js';
	import { createCETEIWithAnnotations } from './cetei.js';
	import { onMount } from 'svelte';

	let container: HTMLElement;
	let sidebar;

	const store = createAnnotationStore();

	onMount(() => {
		const cetei = createCETEIWithAnnotations(store);
		cetei.getHTML5('/test-tei/smallform_0231.xml', (data) => {
			document.getElementById('TEI').appendChild(data);
		});
	});
</script>

<div class="grid grid-cols-3 gap-4">
	<!-- TEXT -->
	<div class="prose col-span-2" id="TEI" bind:this={container}></div>

	<!-- SIDEBAR -->
	<div class="h-screen overflow-auto border-l pl-4" bind:this={sidebar}>
		{#each store.annotations as a}
			<div class="annotation-note cursor-pointer rounded p-2" on:click={() => store.activate(a.id)}>
				<span class="mr-2 font-bold">{a.index}.</span>
				{@html a.content}
			</div>
		{/each}
	</div>
</div>
