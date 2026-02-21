<script lang="ts">
	let { annot, docId } = $props();

	// Load Component with Global Comment
	let Annotations: Component[] | [] = $state([]);
	let annotIds = annot[docId]?.annotIds ? annot[docId].annotIds : [];

	import type { Component } from 'svelte';
	annotIds.forEach((annotId) => {
		(async () => {
			if (docId) {
				try {
					Annotations.push((await import(`$lib/data/annotations/${annotId}.svelte`)).default);
				} catch (error) {}
			}
		})();
	});
</script>

<div class="flex h-full flex-col gap-2 overflow-y-auto">
	{#each Annotations as Annotation, idx}
		<div data-dom="annotation" class="p-2">
			<span>{idx + 1}</span>
			<Annotation />
		</div>
	{/each}
</div>

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	[data-dom='annotation'] {
		:global([data-type='entity']) {
			@apply underline decoration-2;
		}
		:global(p) {
			@apply my-4;
		}
	}
</style>
