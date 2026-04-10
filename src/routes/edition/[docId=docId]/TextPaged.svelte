<script lang="ts">
	import CETEI from 'CETEIcean';
	import { behaviors } from '$lib/CETEIcean/behaviors';

	let { docId, currentPage, ceteiData } = $props();
	const c = new CETEI();

	const setupCustomElements = () => {
		c.addBehaviors(behaviors(document));
		c.processPage();
	};
</script>

<div
	data-dom="containerMaintext"
	data-textflow="paged"
	class="overflow-y-auto p-10"
	{@attach setupCustomElements}
>
	{@html ceteiData.serialized}
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
