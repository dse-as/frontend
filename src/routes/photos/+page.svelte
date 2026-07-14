<script lang="ts">
	import { resolve } from '$app/paths';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import DocumentsNav from '$lib/components/DocumentsNav.svelte';
	import IIIFThumb from '$lib/components/IIIF_Thumb.svelte';
	import type { TPhotosKeys } from '$lib/types/documents/TPhotosKeys';
	import type { TSeqPhotoseriesKeys } from '$lib/types/TSequences.js';
	import { ScrollState } from 'runed';
	import { useSearchParams } from 'runed/kit';
	import { productSearchSchema } from './schemas';

	const params = useSearchParams(productSearchSchema);

	let { data } = $props();

	// UI State
	let isMinimized = $state(false);
	$effect(() => {
		const _1 = params.series;
		isMinimized = params.series ? true : false;
	});

	// Thresholds
	const SHOW_THRESHOLD = 100;
	const HIDE_THRESHOLD = 150; // Must scroll higher to hide

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

	// Filtering
	let searchTerm = $state('');

	let photoKeysAll = $derived(
		params.series ? (data.photoSequences[params.series]?.docs as TPhotosKeys[]) : []
	);
	let filteredDocs = $derived.by(() => {
		// Filter Function
		type TSinglePhoto = (typeof data.photos)[keyof typeof data.photos];
		const filterFunction = (photo_data: TSinglePhoto) => {
			const m = photo_data.metadata;

			// Normalize the search term once to lowercase
			const lowerSearchTerm = searchTerm.toLowerCase();

			// Check title and comments (strings)
			const commentsMatch =
				(m?.title?.toLowerCase().includes(lowerSearchTerm) ?? false) ||
				(m?.comments_1?.toLowerCase().includes(lowerSearchTerm) ?? false) ||
				(m?.comments_2?.toLowerCase().includes(lowerSearchTerm) ?? false);

			// Check captions (arrays of strings)
			const captionsMatch =
				(m?.captions_1?.some((str) => str?.toLowerCase().includes(lowerSearchTerm)) ?? false) ||
				(m?.captions_2?.some((str) => str?.toLowerCase().includes(lowerSearchTerm)) ?? false);

			return commentsMatch || captionsMatch;
		};
		// Return filtered docs array
		return photoKeysAll?.filter((photoKey) => filterFunction(data.photos[photoKey]));
	});

	let filterTop = $state(0);
	$effect(() => {
		const _1 = scroll.y;
		const _2 = isNavHidden;
		const top =
			(document.querySelector('[data-dom=topStickyElement]')?.clientTop || 0) +
			(document.querySelector('[data-dom=topStickyElement]')?.clientHeight || 0);
		console.log(document.querySelector('[data-dom=topStickyElement]')?.clientTop);
		console.log(document.querySelector('[data-dom=topStickyElement]')?.clientHeight);
		filterTop = top;
	});
</script>

<!-- Series -->
{#snippet keyList(keys: TSeqPhotoseriesKeys[])}
	<div
		class={[
			'preset-btn-list items-center justify-center',
			isMinimized ? '--spacing-sm' : '--spacing-sm'
		]}
	>
		{#each keys as key (key)}
			<button
				class={[
					'preset-btn-round duration-200',
					params.series === key && '--active',
					isMinimized && '--sm'
				]}
				onclick={() => {
					params.series = key;
				}}>{data.photoSequences[key]?.name_short}</button
			>
		{/each}
	</div>
{/snippet}

<div
	data-dom="topStickyElement"
	class={[
		'z-100 flex flex-col bg-background px-10 ',
		isMinimized ? 'sticky top-0 gap-2 py-5' : 'mx-auto max-w-300 gap-10'
	]}
>
	<!-- Navigation -->
	<DocumentsNav docType="photos" />
	<h1
		class={[
			'text-center whitespace-nowrap transition-all duration-200',
			isMinimized ? 'h3 mb-5' : 'h1 mb-5 pl-10'
		]}
	>
		{@html isMinimized
			? params.series
				? data.photoSequences[params.series]?.preamble
				: ''
			: dictDoc['photos']?.label_plural}
	</h1>
	<div class={['flex flex-col gap-5', isMinimized && 'hidden']}>
		<p>
			Die Fotografien von Annemarie Schwarzenbach entstanden auf ihren Reisen durch Europa, den
			Nahen Osten, Asien und die USA in den 1930er und 1940er Jahren. Sie stehen in engem
			Zusammenhang mit ihren literarischen und journalistischen Texten und werden in dieser
			digitalen Edition erstmals gemeinsam mit den Kleinen Formen und Briefen präsentiert. Dadurch
			wird die Verflechtung von Bild und Text sichtbar, die Schwarzenbachs Schaffen prägt.
		</p>
		<p>
			Die Metadaten stammen überwiegend aus den Beständen des Schweizerischen Literaturarchivs
			(SLA). In Übereinstimmung mit den <a
				class="hyperlink"
				href={resolve('/project/docs/nicht-edieren-von-diskriminierung')}
				target="blank"
				rel="noopener noreferrer"
				><em>Richtlinien &laquo;(Nicht-)edieren diskriminierender Inhalte&raquo;</em></a
			> wurden punktuell Anpassungen vorgenommen.
		</p>
	</div>

	<!-- Series Keys Large -->
	<div class={['flex flex-col gap-20 py-5', isMinimized && 'hidden']}>
		<div class="flex flex-col gap-5">
			<h2 class="h2 mb-5 text-center">Sammlungen SLA</h2>
			<p>
				Die hier zusammengestellten Sammlungen entsprechen der Katalogisierung des Schweizerischen
				Literaturarchivs (SLA). Auswahl und Reihenfolge wurden unverändert übernommen und direkt
				wiedergegeben.
			</p>
			{@render keyList(data.seriesKeys.SLA as TSeqPhotoseriesKeys[])}
		</div>
		<div class="flex flex-col gap-5">
			<h2 class="h2 mb-2 text-center">Kuratierte Spezial-Sammlungen</h2>
			<p>
				Die nachfolgenden Sammlungen sind als exemplarische Skizzen konzipiert. Sie verdeutlichen
				die Möglichkeit, weitere Zusammenstellungen von Schwarzenbachs Fotografien direkt auf dieser
				Plattform zugänglich zu machen. Dynamische Ad-hoc-Zusammenstellungen werden künftig
				zusätzlich über die Suchfunktion verfügbar sein.
			</p>
			{@render keyList(data.seriesKeys.other as TSeqPhotoseriesKeys[])}
		</div>
		<div class="flex flex-col gap-5">
			<h2 class="h2 text-center">Demo-Shortcuts</h2>
			<h5 class="h5 text-center">Bilder mit Content Notes</h5>
			<ul class="preset-btn-list --spacing-sm items-center justify-center">
				<li class="preset-btn-round"><a href={resolve('/photo_0001')}>Fotografie 0001</a></li>
				<li class="preset-btn-round"><a href={resolve('/photo_3840')}>Fotografie 3840</a></li>
				<li class="preset-btn-round"><a href={resolve('/photo_3834')}>Fotografie 3834</a></li>
			</ul>
		</div>
	</div>

	<!-- Series Keys Minimized -->
	<div class={[isMinimized && 'hidden lg:block']}>
		<div
			class={[
				'transition-opacity duration-500',
				isNavHidden ? 'h-0 overflow-y-hidden opacity-0' : isMinimized && 'h-0 lg:h-max'
			]}
		>
			{@render keyList([...data.seriesKeys.SLA, ...data.seriesKeys.other] as TSeqPhotoseriesKeys[])}
		</div>
	</div>
</div>

<div class="px-10">
	<!-- Intro -->
	<div
		class={[
			'mx-auto mt-5 mb-30 flex max-w-300 flex-col gap-5 px-10 lg:mt-30',
			!isMinimized && 'hidden'
		]}
	>
		<h5 class="h5">Überblickskommentar</h5>
		<p>
			{@html (params.series ? data.photoSequences[params.series]?.intro || '' : '') +
				' Die folgende Zusammenstellung entspricht der Katalogisierung des Schweizerischen Literaturarchivs (SLA). Auswahl und Reihenfolge wurden unverändert übernommen und direkt wiedergegeben.' +
				' Vermutlich ist dieser Text dann noch etwas länger, deshalb noch ein wenig' +
				' lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
		</p>
	</div>

	<!-- Filter -->
	{#if filteredDocs}
		<div
			class={['sticky z-1000 flex flex-col items-end bg-background pb-5', !isMinimized && 'hidden']}
			style={`top:${Math.min(filterTop, 500) || 0}px`} //! Fix this heuristic
		>
			<input
				type="text"
				placeholder="Fotos nach Stichwort filtern..."
				class={[
					'w-80 rounded-xl border-[1.5px] border-foreground px-2 duration-200 focus:w-100',
					searchTerm && 'w-100'
				]}
				bind:value={searchTerm}
			/>
			<p>
				{filteredDocs?.length || 0} / {photoKeysAll?.length || 0}
			</p>
		</div>
	{/if}

	<!-- Gallery -->
	<div class="grid h-full grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-5">
		{#each filteredDocs as photoKey (photoKey)}
			{@const item = data.photos[photoKey as TPhotosKeys]}
			<a
				href={resolve(`/${photoKey as string}`) + `?seq=${params.series}`}
				class="flex items-start justify-start gap-5 rounded-card p-5 hover:bg-dark-10 lg:flex-col lg:items-center lg:justify-center"
			>
				<IIIFThumb
					url={item.faksimile.iiif_image_emanuscripta?.replace('/full/304/0/default.jpg', '')}
					iiif_imageAPI_width={400}
					classes="w-[200px] h-[200px]"
				/>
				<p class="text-left lg:text-center">{item.name}</p>
				<p class="text-left lg:text-center">{photoKey}</p>
			</a>
		{/each}
	</div>
</div>
