<script lang="ts">
	import { handleAnnotationClick } from '$lib/functions/interactive_edendum/handleInteractiveText';

	let { ceteiData } = $props();

	let notesHtml = $derived.by(() => {
		const match = ceteiData.serialized.match(/<ol class="notes">(.*?)<\/ol>/s);
		return match ? match[1] : '';
	});
</script>

<div
	data-dom="containerAnnotations"
	class="mx-2 flex h-full flex-col overflow-y-auto pt-5 pb-20 hyphens-auto"
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<ol
		class="notes"
		onclick={(ev: Event) => {
			const key = ev.target.closest('li')?.getAttribute('data-noteid');
			handleAnnotationClick(key);
		}}
	>
		<!-- list items are styled inside <style> -->
		{@html notesHtml}
	</ol>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	[data-dom='containerAnnotations'] {
		:global(li) {
			padding-bottom: 15px;
			padding-top: 15px;
			cursor: pointer;
			display: grid;
			grid-template-columns: 50px auto 20px;
		}
		:global(li.active),
		:global(li.active:hover) {
			background-color: var(--color-note-active);
		}

		:global(li) > :global(.data-noteidx) {
			grid-column: 1;
		}

		:global(li) > :global(*:not(.data-noteidx)) {
			grid-column: 2;
		}

		:global(li:hover) {
			background-color: var(--color-note-hover);
		}

		:global([data-type='entity']) {
			@apply underline decoration-2;
		}
		:global(p) {
			@apply my-4;
		}
		:global(.data-noteidx) {
			/* @apply mr-5 underline; */
			margin-right: 15px;
			height: 30px;
			width: 30px;
			padding: 3px 10px;
			font-size: 1rem;
			border-color: var(--color-surface-800);
			border-width: 1.2px;
			border-radius: 100%;
		}
	}
</style>
