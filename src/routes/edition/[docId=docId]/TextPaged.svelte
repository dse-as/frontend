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
	data-textflow="diplomatic"
	class="relative mx-auto w-200 overflow-y-auto pl-5"
	{@attach setupCustomElements}
>
	{@html serializedWithoutNotes}
</div>
