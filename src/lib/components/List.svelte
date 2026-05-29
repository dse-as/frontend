<script
	lang="ts"
	generics="
		T extends 'documents' | 'register'
	"
>
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import Switch from './ui/Switch.svelte';

	import { filterAndSortData } from '$lib/functions/ease_of_use/filterAndSortData';
	import { normalizeChars } from '$lib/functions/ease_of_use/normalizeChars';
	import { slugify } from '$lib/functions/ease_of_use/slugify';
	import { uiOvSortBy, uiOvGroupByCat } from '$lib/globals/ui-states.svelte';
	import { TYPESWITHGROUPCONTROL, TYPESWITHSORTCONTROL } from '$lib/globals/constants.svelte';
	import Shortcuts from '$lib/components/Shortcuts.svelte';
	import type {
		TRegDict,
		TRegGroupsMap,
		TRegister,
		TRegKeysFlat,
		TRegTypes
	} from '$lib/types/register/TRegister';
	import type {
		TDocDict,
		TDocGroupsMap,
		TDocKeys,
		TDocTypes,
		TDocuments
	} from '$lib/types/documents/TDocuments';
	import { invertScroll } from '$lib/functions/invertScroll';

	type TProps = T extends 'documents'
		? {
				itemVariant: 'documents';
				itemType: TDocTypes;
				itemData: TDocuments['documents'][TDocTypes];
				itemDict: TDocDict['dict_docs'][TDocTypes];
				itemKey?: TDocKeys | null;
			}
		: {
				itemVariant: 'register';
				itemType: TRegTypes;
				itemData: TRegister['register'][TRegTypes];
				itemDict: TRegDict['dict_register'][TRegTypes];
				itemKey?: TRegKeysFlat | null;
			};

	let {
		itemVariant,
		itemType,
		itemData,
		itemDict,
		itemKey = null,
		isMultiColumn,
		cheatPageHeightInRegSingleColView = ''
	}: TProps & {
		isMultiColumn: boolean;
		cheatPageHeightInRegSingleColView?: string;
	} = $props();

	// Booleans for sorting and grouping
	let hasGroupControls = $derived(TYPESWITHGROUPCONTROL[itemVariant].includes(itemType));
	let hasSortControls = $derived(TYPESWITHSORTCONTROL[itemVariant].includes(itemType));

	// Defaults
	let defaultSortBy = $derived(itemType === 'people' ? 'lastname' : 'name'); // must also set 'name' in ui.svelte.ts (//! Fix this)
	let sortBy = $derived(hasSortControls ? uiOvSortBy[itemVariant] : defaultSortBy); // The actual sortBy state, which includes a fallback for regTypes without sorting options.
	$effect(() => {
		uiOvSortBy[itemVariant] = uiOvSortBy[itemVariant] ? uiOvSortBy[itemVariant] : defaultSortBy; // If empty set to default
	});

	let allGroupKeys = $derived(
		//! IMPROVE: the order inside the unordered object array may actually break.
		itemVariant === 'documents'
			? (Object.keys(itemDict.groups) as TDocGroupsMap[TDocTypes][])
			: (Object.keys(itemDict.groups) as TRegGroupsMap[TRegTypes][])
	);

	// Variables for autoCatLabels (Alphabet or Dates)
	//! IMPROVE: this should be generalised as soon as more types receive sorting-options
	let sortVariableKeyForShortcuts = $derived(
		itemType === 'people' ? 'lastname' : itemType === 'events' ? sortBy : 'name'
	);
	let autoCatLabels = $derived(
		[
			...new Set(
				Object.values(itemData).map((el) => {
					// Normalize autoCatLabels to group e.g. Ç with C and Ä with A
					return normalizeChars(el[sortVariableKeyForShortcuts]?.[0]?.toUpperCase());
				})
			)
		].sort()
	);

	// Scroll to the specific item
	let ovListScrollContainer: HTMLElement | undefined = $state();

	function scrollToItem(itemKey: TRegKeysFlat | TDocKeys) {
		const targetElement = document.getElementById(itemKey);
		const offsetSortControls =
			hasGroupControls && hasSortControls ? 92 : hasGroupControls || hasSortControls ? 60 : 0;
		if (targetElement) {
			ovListScrollContainer?.scrollTo({
				top: targetElement.offsetTop - ovListScrollContainer.offsetTop - offsetSortControls,
				behavior: 'smooth'
			});
		}
	}

	$effect(() => {
		if (itemKey) scrollToItem(itemKey);
	});
</script>

<!-- Snippet for Register Items -->
{#snippet regListItem(key: string, name: string | null)}
	<a
		data-sveltekit-preload-data="tap"
		data-sveltekit-preload-code="hover"
		id={key}
		class={[
			'align-left block w-90 border-b px-5 py-3 text-left',
			!isMultiColumn && key === itemKey && 'bg-surface-300-700 font-bold'
		]}
		href={resolve(itemVariant === 'documents' ? `/edition/${key}` : `/edition/register/${key}`)}
	>
		<span class="overflow-hidden whitespace-normal">
			{name ? `${name}` : '...'}
		</span>
	</a>
{/snippet}

<!-- Snippet for Group Titles (i.e. autoCatLabels or Category Names) -->
{#snippet groupTitle(value: string)}
	<button
		onclick={async () => {
			if (isMultiColumn) {
				await goto(`#${slugify(value, { slash: true })}`, {
					replaceState: true,
					noScroll: true,
					keepFocus: true
				});
				window.scrollTo({ top: 0, behavior: 'instant' });
			}
		}}
		aria-label="store in URL"
		id={slugify(value, { slash: true })}
		class={[
			'group align-left block min-h-25 w-90 border-b px-5 pt-10 text-left font-serif text-4xl font-bold',
			!isMultiColumn && 'pointer-events-none'
		]}
	>
		<div class="h-full">
			<p class="inline-block">
				{value}
				{#if isMultiColumn}
					<span class="hidden group-hover:inline-block">
						<i class="fa-solid fa-link mx-2 text-xl"></i>
					</span>
				{/if}
			</p>
		</div>
	</button>
{/snippet}

<!-- Snippet for Sorting Controls -->
{#snippet sortControls()}
	{#if hasSortControls}
		<div class={['flex flex-wrap items-center gap-2', isMultiColumn ? 'text-base' : 'text-xs']}>
			<p>Sortierung:</p>
			{#snippet sortButton(name: string, sortKey: string)}
				<button
					class={[
						uiOvSortBy[itemVariant] === sortKey
							? 'pointer-events-none font-bold text-surface-950-50'
							: 'text-primary-500 underline'
					]}
					onclick={() => {
						uiOvSortBy[itemVariant] = sortKey;
					}}>{name}</button
				>
			{/snippet}
			<div>
				{@render sortButton('alphabetisch', 'name')}
				<span>/</span>
				{@render sortButton('chronologisch', 'date')}
			</div>
		</div>
	{/if}
{/snippet}

<!-- Snippet for Grouping Controls -->
{#snippet groupControls()}
	{#if hasGroupControls}
		<div class={['flex flex-wrap gap-2', isMultiColumn ? 'text-base' : 'text-xs']}>
			<Switch bind:checked={uiOvGroupByCat[itemVariant]} type={isMultiColumn ? 'small' : 'base'} />
		</div>
	{/if}
{/snippet}

<!-- RegList Container (including other navigation) -->
<div class="overflow-y-auto">
	<!-- Controls (when outside scroll container) -->
	{#if isMultiColumn}
		<div class="my-10 flex w-full flex-col flex-wrap items-start justify-start gap-x-10 gap-y-6">
			<div class="flex gap-5">
				{@render groupControls()}
				{@render sortControls()}
			</div>

			<!-- TypeScript requires to split this conditional component call -->
			{#if itemVariant === 'documents'}
				<Shortcuts
					itemVariant="documents"
					dict={itemDict as TDocDict['dict_docs'][TDocTypes]}
					{hasGroupControls}
					{autoCatLabels}
					allGroupKeys={allGroupKeys as TDocGroupsMap[TDocTypes][]}
				/>
			{:else if itemVariant === 'register'}
				<Shortcuts
					itemVariant="register"
					dict={itemDict as TRegDict['dict_register'][TRegTypes]}
					{hasGroupControls}
					{autoCatLabels}
					allGroupKeys={allGroupKeys as TRegGroupsMap[TRegTypes][]}
				/>
			{/if}
		</div>
	{/if}

	<!-- Scroll Container -->
	<div
		bind:this={ovListScrollContainer}
		// redirect vertical scroll to horizontal scroll
		onwheel={(ev) => {
			if (isMultiColumn && ovListScrollContainer) {
				invertScroll(ev);
			}
		}}
		class={[
			'flex w-full flex-col',
			isMultiColumn
				? //! h-[65vh] is not optimal, but h-full will not make the flex wrap.
					'mt-10 h-[65vh] flex-wrap content-start gap-x-16 overflow-x-auto pb-10'
				: 'mt-5 overflow-y-auto pr-6'
		]}
		style={cheatPageHeightInRegSingleColView}
	>
		<!-- Controls (when inside scroll container) -->
		{#if !isMultiColumn}
			<div
				class={[
					// "sticky top-0",
					'flex w-full flex-col items-end justify-center gap-x-4 gap-y-2 bg-surface-50-950 pb-10'
				]}
			>
				{@render groupControls()}
				{@render sortControls()}
			</div>
		{/if}

		{#if hasGroupControls && uiOvGroupByCat[itemVariant]}
			<!-- Grouped by categories -->
			{#each allGroupKeys as groupKey (groupKey)}
				{#if groupKey && groupKey !== '?'}
					{@render groupTitle(
						//! FIX hardcoded types!
						(
							itemDict.groups[groupKey as keyof typeof itemDict.groups] as Record<
								'label_plural',
								any
							>
						)?.label_plural || '?'
					)}
					{#each filterAndSortData( itemData, sortBy, { filterKey: 'type', filtersIn: [groupKey] } ) as [key, item] (key)}
						{@render regListItem(key, item.name)}
					{/each}
				{/if}
			{/each}
		{:else if itemType}
			<!-- All other types -->
			{@const sortedData = filterAndSortData(itemData, sortBy)}
			{#each sortedData as [key, item], i (key)}
				{@const itemBefore = sortedData[i - 1]?.[1]}
				{@const autoCatLabel =
					hasSortControls && sortBy === 'date'
						? item.date.from.slice(0, 4)
						: normalizeChars(item[sortBy]?.[0]?.toUpperCase())}
				{@const catLabelBefore =
					hasSortControls && sortBy === 'date'
						? itemBefore?.date.from.slice(0, 4)
						: normalizeChars(itemBefore?.[sortBy]?.[0]?.toUpperCase())}
				{#if autoCatLabel && autoCatLabel !== catLabelBefore}
					{@render groupTitle(autoCatLabel)}
				{/if}
				{@render regListItem(key, item.name)}
			{/each}
		{/if}
	</div>
</div>
