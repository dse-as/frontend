<script lang="ts">
	import CETEI from 'CETEIcean';
	import { behaviors, removeNotesFromMaintext, extractPage } from '$lib/CETEIcean/behaviors';

	const c = new CETEI();
	let { ceteiData, page } = $props();

	const setupCustomElements = () => {
		c.addBehaviors(behaviors(document));
		c.processPage();
	};

	// Extract the specific page based on xml:id, then remove notes
	let serializedWithoutNotes = $derived(
		removeNotesFromMaintext(extractPage(ceteiData.serialized, page))
	);
</script>

<div
	data-textflow="diplomatic"
	class="relative mx-auto max-w-200 overflow-y-auto pl-5"
	{@attach setupCustomElements}
>
	{@html serializedWithoutNotes}
</div>
