<script lang="ts">
	import register from '$lib/data/register.json';

	//! How to use the types? (@sebi)
	import { type TRegister } from '$lib/types/register/TRegister';

	//! How to make this nicer? (@sebi)
	let reg = register.register;

	let sortEventsBy = $state('name'); // 'name' or 'date'

	function sortData(data, sortBy, filterValue = undefined) {
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
		// Filter and sort data
		return Object.entries(data)
			.map(([key, entry]) => ({ key, ...entry })) // Include the key in each value
			.filter((entry) => (filterValue ? entry.type === filterValue : true))
			.sort((a, b) => sortFunction(a, b));
	}
</script>

<!-- Snippet for Entity-Item -->
{#snippet entityItem(type, item)}
	{#if type === 'people'}
		<a href={`#${item.key}`}>
			<h3 id={item.key} class="h3">{item.name ? `${item.name}` : '...'}</h3>
		</a>
		{#if item.type}<p>{item.type}</p>{/if}
		<div class="mt-2">
			{#if item.nameVariants.length}
				<p>
					<strong>Alternative Namen: </strong>
					<span class="italic">{item.nameVariants.join(', ')}</span>
				</p>
			{/if}
			{#if item.organisationId}
				<p>
					<strong>Affiliation:</strong>
					<a href={`#${item.organisationId}`}>
						{`${reg.orgs[item.organisationId]?.name}`}
					</a>
				</p>
			{/if}
		</div>
		<p class="mt-2">
			{#if item.note}{item.note}{/if}
			{#if item.gndNumber}
				(<a class="text-primary-500 underline" href={`https://d-nb.info/gnd/${item.gndNumber}`}
					>GND</a
				>)
			{/if}
		</p>
	{:else if type === 'places' || type === 'orgs' || type === 'keywords'}
		<a href={`#${item.key}`}>
			<h3 id={item.key} class="h3">{item.name}</h3>
		</a>
		<p>{item.name}</p>
		{#if item.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${item.gndNumber}`}>See in GND</a
			>
		{/if}
	{:else if type === 'events'}
		<a href={`#${item.key}`}>
			<h3 id={item.key} class="h3">{item.name}</h3>
		</a>
		{#if item.date}
			<p>{item.date.from} bis {item.date.to}</p>
		{/if}
	{:else if type === 'bibls'}
		<a href={`#${item.key}`}>
			<h3 id={item.key} class="h3">{item.name}</h3>
		</a>
		{@const author = reg.people?.[item.authorId]}
		{#if author}
			<p>
				{#if author?.firstname}
					<a href={`#${item.authorId}`}>By {author.firstname} {author.lastname}</a>
				{:else}
					<a href={`#${item.authorId}`}>By {author.name}</a>
				{/if}
				{#if item.pubDate}
					<span>({item.pubDate})</span>
				{/if}
			</p>
		{/if}
		{#if item.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${item.gndNumber}`}>See in GND</a
			>
		{/if}
	{/if}
{/snippet}

<!-- Snippet for Register Group -->
{#snippet registerGroup(type, title, subreg)}
	<div>
		<!-- Group Title -->
		<div class="flex flex-col bg-surface-950-50 p-3">
			<h2 id={type} class="h2 text-surface-50-950">
				{title}
			</h2>
			<!-- Sorting Controls -->
			{#if type === 'events'}
				<div class="my-3 flex w-50 items-center justify-center border-2 bg-surface-50-950 p-1">
					<label class="mx-3 font-bold" for="event-type-selector">Sort by:</label>
					<select id="event-type-selector" bind:value={sortEventsBy}>
						<option value="name">Name</option>
						<option value="date">Date</option>
					</select>
				</div>
			{/if}
		</div>

		<!-- Entities of that Group -->
		{#if type === 'people'}
			{#each sortData(subreg, 'lastname') as data}
				<div class="border-t-2 border-surface-200 py-3 pl-5">
					{@render entityItem('people', data)}
				</div>
			{/each}
		{:else if type === 'events'}
			<!-- Travels -->
			<h4 class="mt-1 bg-surface-950-50 h4 text-surface-50-950">Reisen</h4>
			{#each sortData(subreg, sortEventsBy, 'travel') as data}
				<div class="border-t-2 border-surface-200 py-3 pl-5">
					{@render entityItem('events', data)}
				</div>
			{/each}
			<!-- Other Events -->
			<h4 class="mt-1 bg-surface-950-50 h4 text-surface-50-950">Andere Events</h4>
			{#each sortData(subreg, sortEventsBy, 'event') as data}
				<div class="border-t-2 border-surface-200 py-3 pl-5">
					{@render entityItem('events', data)}
				</div>
			{/each}
		{:else}
			{#each sortData(subreg, 'name') as data}
				<div class="border-t-2 border-surface-200 py-3 pl-5">
					{@render entityItem(type, data)}
				</div>
			{/each}
		{/if}
	</div>
{/snippet}

<div class="grid h-[calc(100vh-48px)] grid-cols-[1fr_5fr] gap-0">
	<!-- Navigation -->
	<nav class="bg-surface-950-50 text-surface-50-950">
		<h2 class="h2"><a href="#people">Personen</a></h2>
		<h2 class="h2"><a href="#places">Orte</a></h2>
		<h2 class="h2"><a href="#events">Events</a></h2>
		<h2 class="h2"><a href="#orgs">Organisationen</a></h2>
		<h2 class="h2"><a href="#bibls">Bibliografie</a></h2>
		<h2 class="h2"><a href="#keywords">Schlagwörter</a></h2>
	</nav>
	<div class="h-full overflow-scroll">
		{@render registerGroup('people', 'Personen', reg.people)}
		{@render registerGroup('places', 'Orte', reg.places)}
		{@render registerGroup('events', 'Events', reg.events)}
		{@render registerGroup('orgs', 'Organisationen', reg.orgs)}
		{@render registerGroup('bibls', 'Bibliografie', reg.bibls)}
		{@render registerGroup('keywords', 'Schlagwörter', reg.keywords)}
	</div>

	<!-- Inhalt Edition -->
	<!-- <nav class="tet-surface-50-950 bg-surface-950-50">
		<h2 class="h2"><a href="#smallforms">Kleine Formen</a></h2>
		<h2 class="h2"><a href="#longforms">Lange Formen</a></h2>
		<h2 class="h2"><a href="#letters">Briefe</a></h2>
	</nav>
	<div class="h-full overflow-scroll">
		{@render registerGroup('smallforms', 'Kleine Formen', reg.smallforms)}
		{@render registerGroup('longforms', 'Lange Formen', reg.longforms)}
		{@render registerGroup('letters', 'Briefe', reg.letters)}
	</div> -->
</div>
