<script lang="ts">
	import { handleNoteClick } from '$lib/functions/handleNoteClick';
	import { selectedNote } from '$lib/globals/state/ui.svelte';
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

<div data-dom="containerAnnotations" class="flex h-full flex-col gap-2 overflow-y-auto">
	{#each Annotations as Annotation, idx}
		{@const noteid = annotIds[idx]}
		<div
			data-dom="annotationBox"
			data-noteid={noteid}
			class="p-2"
			onclick={() => {
				handleNoteClick(noteid);
				selectedNote.id = noteid;
			}}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ' ? handleNoteClick(noteid) : null)}
			role="button"
			tabindex="0"
			aria-pressed={selectedNote.id === noteid}
			aria-label="Focus note"
		>
			<span>{idx + 1}</span>
			<Annotation />
		</div>
	{/each}
</div>

<style>
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";

	[data-dom='annotationBox'] {
		:global([data-type='entity']) {
			@apply underline decoration-2;
		}
		:global(p) {
			@apply my-4;
		}
		:global(&.highlighted) {
			@apply bg-green-300;
		}
	}
</style>
