<script lang="ts">
	import { goto } from '$app/navigation';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	import { register as reg } from '$lib/data/register.json';
	import { dict_register as dictReg } from '$lib/dictionaries/dict_register.json';

	import { filterAndSortData } from '$lib/functions/ease_of_use/filterAndSortData';
	import { normalizeChars } from '$lib/functions/ease_of_use/normalizeChars';
	import { slugify } from '$lib/functions/ease_of_use/slugify';
	import { uiRegSortBy, uiRegGroupByCat } from '$lib/globals/state/ui.svelte';

	// Props
	let { isMultiColumn, regType, regItem = null, cheatPageHeightInRegSingleColView = '' } = $props();

	// States for sorting and grouping
	let hasGroupControls = $derived(['events', 'orgs', 'people', 'places'].includes(regType));
	let hasSortControls = $derived(regType === 'events');
	let hasControls = $derived(hasGroupControls || hasSortControls);

	// Defaults
	const defaultSortBy = regType === 'people' ? 'lastname' : 'name';
	uiRegSortBy.id = uiRegSortBy.id ? uiRegSortBy.id : defaultSortBy; // If empty set to default
	let sortBy = $derived(hasSortControls ? uiRegSortBy.id : defaultSortBy); // The actual sortBy state, which includes a fallback for regTypes without sorting options.

	let allTypeKeys = $derived(
		[
			...new Set(
				Object.values(reg[regType]).map((el) => {
					return el.type;
				})
			)
		].sort()
	);

	// Variables for autoCatLabels (Alphabet or Dates)
	//! IMPROVE: this should be generalised as soon as more types receive sorting-options
	let sortVariableKeyForAlphabet = $derived(
		regType === 'people' ? 'lastname' : regType === 'events' ? sortBy : 'name'
	);
	let currentAutoCatLabel: string | null = null;
	let autoCatLabels = $derived(() => {
		[
			...new Set(
				Object.values(reg[regType]).map((el) => {
					// Normalize autoCatLabels to group e.g. Ç with C and Ä with A
					return normalizeChars(el[sortVariableKeyForAlphabet][0]?.toUpperCase());
				})
			)
		].sort();
	});

	// Scroll to the specific item
	let regListScrollContainer: HTMLElement | undefined = $state();

	function scrollToItem(itemKey) {
		const targetElement = document.getElementById(itemKey);
		const offsetSortControls =
			hasGroupControls && hasSortControls ? 92 : hasGroupControls || hasSortControls ? 60 : 0;
		if (targetElement) {
			regListScrollContainer.scrollTo({
				top: targetElement.offsetTop - regListScrollContainer.offsetTop - offsetSortControls,
				behavior: 'smooth'
			});
		}
	}

	$effect(() => {
		if (regItem) scrollToItem(regItem);
	});
</script>

<!-- Snippet for Register Items -->
{#snippet regListItem(item)}
	<a
		id={item.key}
		class={[
			'align-left block w-90 border-b px-5 py-3 text-left',
			!isMultiColumn && item.key === regItem && 'bg-surface-100-900 font-bold'
		]}
		href={item.key}
	>
		<span class="overflow-hidden whitespace-normal">
			{item.name ? `${item.name}` : '...'}
		</span>
	</a>
{/snippet}

<!-- Snippet for Group Titles (i.e. autoCatLabels or Category Names) -->
{#snippet groupTitle(value)}
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
			{#snippet sortButton(name, sortKey)}
				<button
					class={[
						uiRegSortBy.id === sortKey
							? 'pointer-events-none font-bold text-surface-950-50'
							: 'text-primary-500 underline'
					]}
					onclick={() => {
						uiRegSortBy.id = sortKey;
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
			<Switch
				checked={uiRegGroupByCat.value}
				onCheckedChange={(details) => (uiRegGroupByCat.value = details.checked)}
			>
				<Switch.Control>
					<Switch.Thumb />
				</Switch.Control>
				<Switch.Label class={[isMultiColumn ? 'text-base' : 'text-xs']}
					>Nach Kategorien gruppieren</Switch.Label
				>
				<Switch.HiddenInput />
			</Switch>
		</div>
	{/if}
{/snippet}

<!-- RegList Container (including other navigation) -->
<div class="overflow-y-auto">
	<!-- Controls (when outside scroll container) -->
	{#if hasControls && isMultiColumn}
		<div class="my-10 flex w-full flex-wrap justify-start gap-x-10 gap-y-2">
			{@render groupControls()}
			{@render sortControls()}
		</div>
	{/if}

	<!-- Scroll Container -->
	<div
		bind:this={regListScrollContainer}
		// redirect vertical scroll to horizontal scroll
		onwheel={(ev) => {
			if (isMultiColumn && regListScrollContainer) {
				const atStart = regListScrollContainer.scrollLeft <= 0;
				const atEnd =
					regListScrollContainer.scrollLeft >=
					regListScrollContainer?.scrollWidth - regListScrollContainer?.clientWidth - 4;
				if (
					!(atStart && atEnd) &&
					((atStart && (ev.deltaY > 0 || ev.deltaX > 0)) ||
						(atEnd && (ev.deltaY < 0 || ev.deltaX < 0)) ||
						(!atStart && !atEnd))
				) {
					ev.preventDefault(); // Prevent default vertical scroll behavior
					regListScrollContainer.scrollLeft += ev.deltaY;
					regListScrollContainer.scrollLeft += ev.deltaX;
				}
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
		{#if hasControls && !isMultiColumn}
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

		{#if hasGroupControls && uiRegGroupByCat.value}
			<!-- grouped by categories -->
			{#each allTypeKeys as typeKey (typeKey)}
				{@render groupTitle(dictReg[regType].type_labels[typeKey]?.label || typeKey || '?')}
				{#each filterAndSortData( reg[regType], sortBy, { filterKey: 'type', filtersIn: [typeKey] } ) as item (item.key)}
					{@render regListItem(item)}
				{/each}
			{/each}
		{:else if regType}
			<!-- All other types -->
			{#each filterAndSortData(reg[regType], sortBy) as item (item.key)}
				{@const autoCatLabel =
					hasSortControls && sortBy === 'date'
						? item.date.from.slice(0, 4)
						: normalizeChars(item[sortBy][0]?.toUpperCase())}
				{#if autoCatLabel && autoCatLabel !== currentAutoCatLabel}
					<!-- Trick: render Letter and at the same time update currentAutoCatLabel with `(current=first)` -->
					{@render groupTitle((currentAutoCatLabel = autoCatLabel))}
				{/if}
				{@render regListItem(item)}
			{/each}
		{/if}
	</div>

	<!-- Alphabet Shortcuts -->
	{#if isMultiColumn && (!hasGroupControls || !uiRegGroupByCat.value)}
		<!-- Hide the alphabet for regTypes with manual sorting, since e.g. sorting for dates or categories would needs a different logic of shortcuts -->
		<div class="mt-10 flex w-full justify-center gap-2">
			{#each autoCatLabels as letter (letter)}
				<button
					onclick={() => {
						goto(`#${letter}`, { replaceState: true, noScroll: true });
						setTimeout(() => {
							window.scrollTo({ top: 0, behavior: 'auto' });
						}, 10);
					}}
					class="center flex h-10 w-10 items-center justify-center underline hover:font-bold"
					><p>{letter}</p></button
				>
			{/each}
		</div>
	{/if}
</div>
