<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc.js';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import { updateSearchParams } from '$lib/functions/ease_of_use/updateSearchParams.js';
	import type { TSeqTypes } from '$lib/types/TSequences.js';

	let { data } = $props();
	let seqType = $derived(page.params.seqType as Exclude<TSeqTypes, 'correspondence'>); //! FIX type exclusion, once structure is stable.
	let seqItems = $derived(data.seqAll[seqType] as Record<string, any>);

	const dictSeqTitles = { series: 'Serien', textstufen: 'Textstufen', travels: 'Reisen' };

	let containerRef: HTMLElement | undefined = $state();
</script>

<h1 class="h1">{dictSeqTitles[seqType]}</h1>

{#each Object.keys(seqItems) as seqItemId (seqItemId)}
	<div class="mt-5 rounded-xl p-5">
		<h4 class="mb-5 h4">{seqItems[seqItemId].preamble}</h4>

		<div bind:this={containerRef} class="flex min-h-30 w-full gap-2 overflow-x-auto px-10">
			{#each seqItems[seqItemId].docs as docId (docId)}
				{@const { item: resDoc } = resolveDoc(data.allDocs, docId) || { item: null }}
				<a
					href={resolve(
						`/edition/${docId}?${updateSearchParams(page.url.searchParams, { seq: seqItemId })}`
					)}
					class={['w-90 rounded-xl p-1']}
				>
					<div class="grid h-full w-full grid-cols-[1fr_3fr] gap-3 px-3 py-1">
						<div class="flex h-full w-full items-center justify-center">
							<IIIF_Thumb
								url={resDoc?.manuscript?.iiif_urls[0]}
								maxWidth="100"
								maxHeight="100"
								classes="rounded-xl"
							/>
						</div>
						<div class="flex flex-col">
							<span class="italic">{resDoc?.metadata?.title_full}</span>
							<span class="">{resDoc?.metadata?.pubDate}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
{/each}
