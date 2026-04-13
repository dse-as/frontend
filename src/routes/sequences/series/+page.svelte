<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId.js';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams.js';

	let { data } = $props();
	let seqItems = $derived(data.seqAll.series as Record<string, any>);

	let containerRef: HTMLElement | undefined = $state();
</script>

<h1 class="h1">Serien</h1>

{#each Object.keys(seqItems) as seqId}
	<div class="mt-5 rounded-xl p-5">
		<h4 class="mb-5 h4">{seqItems[seqId].preamble}</h4>

		<div bind:this={containerRef} class="flex min-h-30 w-full gap-2 overflow-x-auto px-10">
			{#each seqItems[seqId].docs as docId, index (docId)}
				{@const itemType = findEdTypeByDocId(docId)}
				{@const itemMeta = data.fullMeta[itemType][docId]}
				<a
					href={resolve(
						`/edition/${docId}?${updateSearchParams(page.url.searchParams, { seq: seqId })}`
					)}
					class={['w-90 rounded-xl p-1']}
					onclick={() => {
						if (!keepPanelOpen) closeSeqPanel(0);
						invalidateAll();
					}}
				>
					<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
						<div class="flex h-full w-full items-center justify-center">
							<IIIF_Thumb
								url={itemMeta?.manuscript?.iiif_urls[0]}
								maxWidth="100"
								maxHeight="100"
								classes="rounded-xl"
							/>
						</div>
						<div class="flex flex-col">
							<span class="italic">{itemMeta?.metadata?.title_full}</span>
							<span class="">{itemMeta?.metadata?.pubDate}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
{/each}
