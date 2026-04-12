<script lang="ts">
	import CETEI from 'CETEIcean';
	import { behaviors, removeNotesFromMaintext } from '$lib/CETEIcean/behaviors';

	const c = new CETEI();
	let { ceteiData } = $props();

	const setupCustomElements = (el: HTMLElement) => {
		c.addBehaviors(behaviors(document));
		c.processPage();
	};
	let serializedWithoutNotes = $derived(removeNotesFromMaintext(ceteiData.serialized));
</script>

<div
	data-dom="containerMaintext"
	data-textflow="paged"
	class="overflow-y-auto p-10"
	{@attach setupCustomElements}
>
	{@html serializedWithoutNotes}
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
