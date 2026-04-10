<script lang="ts">
	import type { Component } from 'svelte';

	let { docId } = $props();
	let HtmlContent: Component | null = $state(null);

	(async () => {
		if (docId) {
			HtmlContent = (await import(`$lib/data/texts/text-${docId}.svelte`)).default;
		}
	})();
</script>

<div data-dom="containerMaintext" data-textflow="paged" class="overflow-y-auto p-10">
	{#if HtmlContent}
		<HtmlContent />
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global([data-textflow='paged']) {
		:global(p) {
			@apply my-4;
		}
	}
</style>
