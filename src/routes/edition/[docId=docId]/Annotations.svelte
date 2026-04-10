<script lang="ts">
	import { handleNoteClick } from '$lib/functions/handleNoteClick';
	import { selectedNote } from '$lib/globals/state/ui.svelte';
	let { ceteiData, docId } = $props();

	let notesHtml = $derived.by(() => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(ceteiData.serialized, 'text/html');
		const ol = doc.querySelector('ol.notes');
		return ol ? ol.innerHTML : '';
	});
</script>

<div data-dom="containerAnnotations" class="flex h-full flex-col gap-2 overflow-y-auto">
	<ol class="notes">
		{@html notesHtml}
	</ol>
</div>

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

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
	}
</style>
