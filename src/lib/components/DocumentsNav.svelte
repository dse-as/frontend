<script lang="ts">
	import type { TDocTypes } from '$lib/types/documents/TDocuments.js';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import { resolve } from '$app/paths';

	let { docType }: { docType: TDocTypes } = $props();

	const navEntries: TDocTypes[] = ['smallforms', 'longforms', 'letters', 'photos'];
</script>

<nav class={['ml-10 flex h-full w-full gap-2 transition-all duration-200']}>
	{#each navEntries as dT (dT)}
		<a class={['preset-btn-round --sm', dT === docType && '--active']} href={resolve(`/${dT}`)}>
			{dictDoc[dT as TDocTypes]?.label_plural}
		</a>
	{/each}
</nav>
