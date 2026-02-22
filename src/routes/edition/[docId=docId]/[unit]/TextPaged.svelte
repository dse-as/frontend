<script lang="ts">
	import type { Component } from 'svelte';

	let { docId, currentPage } = $props();
	let HtmlContent: Component | null = $state(null);

	(async () => {
		if (docId) {
			HtmlContent = (await import(`$lib/data/texts/text-${docId}.svelte`)).default;
		}
	})();
</script>

<div data-textflow="paged" class="overflow-y-auto p-10">
	{#if HtmlContent}
		<HtmlContent />
	{/if}
</div>

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global([data-textflow='paged']) {
		:global(p) {
			@apply my-4;
		}
	}
</style>
