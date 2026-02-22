<script lang="ts">
	import type { Component } from 'svelte';

	let { docId } = $props();
	let HtmlContent: Component | null = $state(null);

	(async () => {
		if (docId) {
			try {
				HtmlContent = (await import(`$lib/data/texts/text-${docId}.svelte`)).default;
			} catch (error) {
				HtmlContent = null;
			}
		}
	})();
</script>

<div data-textflow="fluid" class="overflow-y-auto p-10">
	{#if HtmlContent}
		<HtmlContent />
	{/if}
</div>

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	:global([data-textflow='fluid']) {
		:global(p) {
			@apply my-4;
		}
	}
</style>
