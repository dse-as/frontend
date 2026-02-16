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
			sortFunction = (a, b) =>
				a[sortBy].from?.localeCompare(b[sortBy].from) ||
				a[sortBy].to?.localeCompare(b[sortBy].to) ||
				Infinity;
		} else {
			// Sort alphabetically by sortBy
			sortFunction = (a, b) => a[sortBy]?.localeCompare(b[sortBy]) || Infinity;
		}
		// Filter and sort data
		return Object.values(data)
			.filter((entry) => (filterValue ? entry.type === filterValue : true))
			.sort((a, b) => sortFunction(a, b));
	}
</script>

<!-- Snippet for Entity-Item -->
{#snippet entityItem(type, item)}
	{#if type === 'people'}
		<h3 class="h3">{item.name ? `${item.name}` : '...'}</h3>
		<!-- <p>{item.type ? ` ${item.type}` : ''}</p> -->
		<!-- <p>{item.nameVariants ? ` ${item.nameVariants}` : ''}</p> -->
		<!-- <p>{item.note ? ` ${item.note}` : ''}</p> -->
		<!-- <p>{item.organisationId ? ` ${reg.organisations[item.organisationId]}` : ''}</p> -->
		{#if item.organisationId}
			<a href={`#${item.organisationId}`}>
				{`${reg.organisations[item.organisationId]?.name}`}
			</a>
		{/if}
		<!--  -->
		{#if item.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${item.gndNumber}`}>See in GND</a
			>
		{/if}
	{:else if type === 'places' || type === 'organisations' || type === 'keywords'}
		<h3 class="h3">{item.name}</h3>
		<p>{item.name}</p>
		{#if item.gndNumber}<a
				class="text-primary-500 underline"
				href={`https://d-nb.info/gnd/${item.gndNumber}`}>See in GND</a
			>
		{/if}
	{:else if type === 'events'}
		<h3 class="h3">{item.name}</h3>
		<p>{item.date?.from} bis {item.date?.to}</p>
	{:else if type === 'works'}
		<h3 class="h3">{item.name}</h3>
		<p>{item.name}</p>
		{@const author = reg.people?.[item.authorId]}
		<p>{author.firstname} {author.lastname}</p>
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
		<h2 id={type} class="bg-surface-950-50 p-3 h2 text-surface-50-950">
			{title}
		</h2>

		<!-- Entities of that Group -->
		{#if type === 'people'}
			{#each sortData(subreg, 'lastname') as data}
				<div class="border-t-2 border-surface-200 py-3 pl-5">
					{@render entityItem('people', data)}
				</div>
			{/each}
		{:else if type === 'events'}
			<!-- Sorting Controls for Events -->
			<div class="mb-3 flex">
				<label class="mx-5" for="event-type-selector">Sort by</label>
				<select id="event-type-selector" bind:value={sortEventsBy}>
					<option value="name">Name</option>
					<option value="date">Date</option>
				</select>
			</div>
			<!-- Travels -->
			<h4 class="bg-surface-950-50 h4 text-surface-50-950">Reisen</h4>
			{#each sortData(subreg, sortEventsBy, 'travel') as data}
				<div class="border-t-2 border-surface-200 py-3 pl-5">
					{@render entityItem('events', data)}
				</div>
			{/each}
			<!-- Other Events -->
			<h4 class="bg-surface-950-50 h4 text-surface-50-950">Andere Events</h4>
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

<div class="grid h-screen grid-cols-[1fr_5fr] gap-10">
	<!-- Navigation -->
	<nav>
		<h2 class="h2"><a href="#people">Personen</a></h2>
		<h2 class="h2"><a href="#places">Orte</a></h2>
		<h2 class="h2"><a href="#events">Events</a></h2>
		<h2 class="h2"><a href="#organisations">Organisationen</a></h2>
		<h2 class="h2"><a href="#works">Werke</a></h2>
		<h2 class="h2"><a href="#keywords">Schlagwörter</a></h2>
	</nav>
	<div class="h-full overflow-scroll">
		{@render registerGroup('people', 'Personen', reg.people)}
		{@render registerGroup('places', 'Orte', reg.places)}
		{@render registerGroup('events', 'Events', reg.events)}
		{@render registerGroup('organisations', 'Organisationen', reg.organisations)}
		{@render registerGroup('works', 'Werke', reg.works)}
		{@render registerGroup('keywords', 'Schlagwörter', reg.keywords)}
	</div>
</div>
