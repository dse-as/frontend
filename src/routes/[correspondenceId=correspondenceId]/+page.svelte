<script lang="ts">
	import { resolve } from '$app/paths';
	import DocumentsNav from '$lib/components/DocumentsNav.svelte';
	import IIIF_Thumb from '$lib/components/IIIF_Thumb.svelte';
	import type { TLettersKeys } from '$lib/types/documents/TLettersKeys';
	import { ScrollState } from 'runed';
	import type { TSeqCorrespondenceKeys } from '$lib/types/TSequences.js';
	import { printDateRange } from '$lib/functions/ease_of_use/dateFunctions';

	let { data } = $props();

	// Thresholds
	const SHOW_THRESHOLD = 100;
	const HIDE_THRESHOLD = 370; // Must scroll higher to hide

	let isNavHidden = $state(false);

	// React to scroll changes
	$effect(() => {
		const y = scroll.y; // Replace with your actual scroll value source

		if (y > HIDE_THRESHOLD) {
			isNavHidden = true;
		} else if (y < SHOW_THRESHOLD) {
			isNavHidden = false;
		}
	});

	// Scroll State
	const scroll = new ScrollState({
		element: () => document
	});
</script>

<!-- Series -->
{#snippet keyList(keys: (TSeqCorrespondenceKeys | 'separator')[])}
	<div class={['preset-btn-list --spacing-sm items-center justify-center']}>
		{#each keys as key (key)}
			{#if key === 'separator'}
				<div class="px-4 text-xl text-background-contrast">{'/'}</div>
			{:else}
				<a
					class={['preset-btn-round --sm duration-200', data.corrSlug === key && '--active']}
					href={resolve(`/${key as string}`)}
					>{data.corrSequences[key as TSeqCorrespondenceKeys].name}</a
				>
			{/if}
		{/each}
	</div>
{/snippet}

<div
	data-dom="topStickyElement"
	class={['sticky top-0 z-100 -mt-10 flex flex-col gap-2 bg-background px-10 pt-10']}
>
	<!-- Navigation -->
	<DocumentsNav docType="letters" />
	<h1 class={['h3 mb-5 text-center whitespace-nowrap transition-all duration-200']}>
		{@html data.corrSlug ? data.corrSequences[data.corrSlug]?.preamble : ''}
	</h1>

	<!-- Series Keys -->
	<div class={['hidden lg:block']}>
		<div
			class={[
				'transition-opacity duration-500',
				isNavHidden ? 'h-0 overflow-y-hidden opacity-0' : 'h-0 lg:h-max'
			]}
		>
			{@render keyList([
				...Object.entries(data.corrSequences)
					.filter(([_, seq]) => seq.type === 'special')
					.map(([key, _]) => key),
				'separator',
				...Object.entries(data.corrSequences)
					.filter(([_, seq]) => seq.type === 'with_person')
					.map(([key, _]) => key)
			] as TSeqCorrespondenceKeys[])}
		</div>
	</div>
</div>

<div class="px-10">
	<!-- Intro -->
	<div class={['mx-auto mt-5 mb-30 flex max-w-300 flex-col gap-5 px-10 lg:mt-30']}>
		<h5 class="h5">Überblickskommentar</h5>
		<p>
			{@html (data.corrSlug && 'intro' in data.corrSequences[data.corrSlug]
				? data.corrSequences[data.corrSlug]?.intro
				: '') +
				(data.corrSequences[data.corrSlug]?.type === 'with_person' && data.crossRef.person
					? ` Die erhaltene Korrespondenz mit <strong>${data.crossRef.person.firstname} ${data.crossRef.person.lastname}</strong> umfasst <strong>${data.corrSequences[data.corrSlug]?.docs.length} Briefe</strong>.`
					: '') +
				' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
		</p>
	</div>

	<!-- Gallery -->
	<div
		class="grid h-full grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
	>
		{#each data.corrSequences[data.corrSlug]?.docs as TLettersKeys[] as corrKey (corrKey)}
			{@const item = data.letters[corrKey as TLettersKeys]}
			<a
				href={resolve(`/${corrKey as string}`) + `?seq=${data.corrSlug}`}
				class="flex items-start justify-start gap-5 rounded-card p-5 hover:bg-dark-10 md:flex-col md:items-center md:justify-center"
			>
				{#if item}
					<IIIF_Thumb
						url={item.manuscript?.iiif_urls[0]}
						iiif_imageAPI_width={400}
						classes="h-[200px]"
					/>
					<p class="flex flex-col gap-2 text-left md:text-center">
						<span>{item.name}</span>
						<span>{printDateRange(item.metadata.date.from, item.metadata.date.to)}</span>
					</p>
				{:else}
					<div class="flex h-[200px] w-[200px] flex-col items-center justify-center text-center">
						<p>{corrKey}</p>
						<p class="text-muted-foreground">(noch keine Metadaten)</p>
					</div>
				{/if}
			</a>
		{/each}
	</div>
</div>
