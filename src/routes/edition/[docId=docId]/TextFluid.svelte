<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { handleMarkClick } from '$lib/functions/handleMarkClick';
	import { handleMarkendClick } from '$lib/functions/handleMarkendClick';
	import { selectedNote } from '$lib/globals/state/ui.svelte';
	import { unselectMarks } from '$lib/functions/unselectMarks';
	import { unselectNotes } from '$lib/functions/unselectNotes';

	let el: HTMLElement;
	let { docId } = $props();
	let HtmlContent: Component | null = $state(null);

	(async () => {
		if (docId) {
			try {
				HtmlContent = (await import(`$lib/data/texts/text-${docId}_withMarks.svelte`)).default;
			} catch (error) {
				HtmlContent = null;
			}
		}
	})();

	//! FIX: I'm using event delegation here, since it would be bad practice
	// to add listeners inside each of the `lib/data/document.svelte` files.
	// Of course I tried to pass them via a :use function on the
	// `[data-dom=containerMaintext]` element, but this did not work.
	// Do you know of any other way to choose addEventListener() instead of event delegation?
	// Otherwise I don't know how I would handle e.g. hovers.

	//! FIX: Also, it may be good practice to programmatically add `tabindex=0` to each of
	// the markend-spans for accessibility reasons. Any idea how to achieve this, agian without
	// going to every single .svelte file?

	function handleDocumentClick(ev) {
		if (ev.target.closest('[data-type="mark"]')) {
			handleMarkClick(ev);
		} else if (ev.target.closest('[data-type="markend"]')) {
			handleMarkendClick(ev);
		} else if (selectedNote.id) {
			unselectMarks();
			unselectNotes();
		}
	}

	onMount(() => {
		el.addEventListener('click', handleDocumentClick);

		return () => {
			el.removeEventListener('click', handleDocumentClick);
		};
	});
</script>

<div data-dom="containerMaintext" data-textflow="fluid" class="overflow-y-auto p-10" bind:this={el}>
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
