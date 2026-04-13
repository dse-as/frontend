<script lang="ts">
	let { ceteiData } = $props();

	let notesHtml = $derived.by(() => {
		const match = ceteiData.serialized.match(/<ol class="notes">(.*?)<\/ol>/s);
		return match ? match[1] : '';
	});
</script>

<div data-dom="containerAnnotations" class="flex h-full flex-col gap-2 overflow-y-auto">
	<ol class="notes">
		{@html notesHtml}
	</ol>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	[data-dom='containerAnnotations'] {
		:global(li) {
			margin-bottom: 25px;
			cursor: pointer;
		}
		:global(li:hover) {
			@apply bg-surface-100-900;
		}
	}
	.notes {
		:global([data-type='entity']) {
			@apply underline decoration-2;
		}
		:global(p) {
			@apply my-4;
		}
		:global(li.highlighted) {
			@apply bg-green-300;
		}
		:global(a) {
			@apply mr-5 underline;
		}
	}
</style>
