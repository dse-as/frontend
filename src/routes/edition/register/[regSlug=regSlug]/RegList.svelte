<script lang="ts">
	import { register as reg } from '$lib/data/register.json';

	let { isMultiColumn, regType, regSlug = null } = $props();
	let sortEventsBy = $state('name'); // 'name' or 'date'
	let currentLetter: string | null = null;

	function normalizeChars(char) {
		switch (char) {
			case 'Ä':
				return 'A';
			case 'Ö':
				return 'O';
			case 'Ü':
				return 'U';
			case 'Ç':
				return 'C';
			default:
				return char;
		}
	}

	function sortData(item, sortBy, filterValue = undefined) {
		let sortFunction;
		if (sortBy === 'date') {
			sortFunction = (a, b) => {
				const compare = (x, y) => {
					if (!x && !y) return 0; // treat as equal
					if (!x) return 1; // Push `x` to the end
					if (!y) return -1; // Push `y` to the end
					return x.localeCompare(y); // Compare normally if both are defined
				};

				// First compare by `from`, then by `to` if needed
				return compare(a[sortBy]?.from, b[sortBy]?.from) || compare(a[sortBy]?.to, b[sortBy]?.to);
			};
		} else {
			// Sort alphabetically by sortBy
			sortFunction = (a, b) => {
				// a[sortBy]?.localeCompare(b[sortBy]) || 0;
				const aName = a[sortBy];
				const bName = b[sortBy];

				// Handle undefined values
				if (!aName && !bName) return 0; // Treat both as equal
				if (!aName) return 1; // Push `a` to the end
				if (!bName) return -1; // Push `b` to the end

				return aName.localeCompare(bName); // Compare normally if both are defined
			};
		}
		// Filter and sort item
		return Object.entries(item)
			.map(([key, entry]) => ({ key, ...(entry as Object) })) // Include the key in each value
			.filter((entry) => (filterValue ? entry.type === filterValue : true))
			.sort((a, b) => sortFunction(a, b));
	}

	// Scroll to the specific item
	let scrollableDiv: HTMLElement | undefined = $state();

	function scrollToItem(itemKey) {
		const targetElement = document.getElementById(itemKey);
		console.log(targetElement);
		console.log(targetElement.offsetTop);
		console.log(scrollableDiv.offsetTop);
		if (targetElement) {
			console.log('HIII');
			scrollableDiv.scrollTo({
				top: targetElement.offsetTop - scrollableDiv.offsetTop,
				behavior: 'smooth'
			});
		}
	}

	$effect(() => {
		console.log(regSlug);
		if (regSlug) scrollToItem(regSlug);
	});
</script>

<div class="h-[80vh] min-w-100 overflow-y-scroll p-2">
	<!-- Snippet for register items -->
	{#snippet regItem(item)}
		<a
			id={item.key}
			class="align-left mx-8 block w-80 border-b px-5 py-3 text-left"
			href={item.key}
		>
			<span class="overflow-hidden whitespace-normal">
				{item.name ? `${item.name}` : '...'}
			</span>
		</a>
	{/snippet}

	{#snippet letter(letter)}
		<p
			id={letter}
			class="align-left mx-8 block min-h-25 w-80 border-b px-5 pt-10 text-left font-serif text-5xl font-bold"
		>
			{letter}
		</p>
	{/snippet}

	<!-- Lists -->

	{#if regType === 'events'}
		<!-- Sorting Controls -->
		<div class="my-3 flex w-50 items-center justify-center border-2 bg-surface-50-950 p-1">
			<label class="mx-3 font-bold" for="event-type-selector">Sort by:</label>
			<select id="event-type-selector" bind:value={sortEventsBy}>
				<option value="name">Name</option>
				<option value="date">Date</option>
			</select>
		</div>

		<div class={['flex h-[50vh] w-full flex-col overflow-x-scroll', isMultiColumn && 'flex-wrap']}>
			<!-- Travels -->
			{@render letter('Reisen')}
			{#each sortData(reg[regType], sortEventsBy, 'travel') as item (item.key)}
				{@render regItem(item)}
			{/each}
			<!-- Other Events -->
			{@render letter('Aufenthalte')}
			{#each sortData(reg[regType], sortEventsBy, 'event') as item (item.key)}
				{@render regItem(item)}
			{/each}
		</div>
	{:else if regType}
		{@const sortVariableKey = regType === 'people' ? 'lastname' : 'name'}
		<div class=" pb-30">
			<div
				bind:this={scrollableDiv}
				class={[
					'flex w-full flex-col',
					isMultiColumn
						? 'mt-15 h-[60vh] flex-wrap overflow-x-scroll'
						: 'mt-5 h-[70vh] overflow-y-scroll' //! adjust h-[] and find out why h-full is not working
				]}
			>
				{#each sortData(reg[regType], sortVariableKey) as item (item.key)}
					{@const firstLetter = normalizeChars(item[sortVariableKey][0]?.toUpperCase())}
					{#if firstLetter && firstLetter !== currentLetter}
						{@render letter((currentLetter = firstLetter))}
					{/if}
					{@render regItem(item)}
				{/each}
			</div>
		</div>
	{/if}
</div>
