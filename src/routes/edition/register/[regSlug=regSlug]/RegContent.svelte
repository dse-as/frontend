<script lang="ts">
	import { register as reg } from '$lib/data/register.json';

	let { type, item } = $props();
</script>

<div class="p-20 pt-10">
	<div>
		<!-- People -->
		{#if type === 'people'}
			<h1 id={item.key} class="h1">{item.name ? `${item.name}` : '...'}</h1>
			<p>{item.type}</p>

			<div class="mt-2">
				{#if item.nameVariants.length}
					<p>
						<strong>Alternative Namen: </strong>
						<span class="italic">{item.nameVariants.join(', ')}</span>
					</p>
				{/if}

				{#if item.orgId}
					<p>
						<strong>Affiliationen:</strong>
						<a href={`#${item.orgId}`}>
							{`${reg.orgs[item.orgId]?.name}`}
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

			<!-- Places / Organisations / Keywords -->
		{:else if type === 'places' || type === 'orgs' || type === 'keywords'}
			<h1 id={item.key} class="h1">{item.name}</h1>
			<div class="p-10">
				{#each Object.keys(item) as key}<p><strong>{key}:</strong> {item[key]}</p>{/each}
			</div>
			{#if item.gndNumber}<a
					class="text-primary-500 underline"
					href={`https://d-nb.info/gnd/${item.gndNumber}`}>See in GND</a
				>
			{/if}

			<!-- Events -->
		{:else if type === 'events'}
			<h1 id={item.key} class="h1">{item.name}</h1>
			{#if item.date}
				<p>{item.date.from} bis {item.date.to}</p>
			{/if}

			<!-- Works -->
		{:else if type === 'works'}
			<h1 id={item.key} class="h1">{item.name}</h1>
			{@const author = reg.people?.[item.authorId]}
			<p>
				{#if author?.firstname}
					<a href={`#${item.authorId}`}>By {author.firstname} {author.lastname}</a>
				{:else}
					<a href={`#${item.authorId}`}>By {author.firstname} {author.lastname}</a>
				{/if}
				{#if item.pubDate}
					<span>({item.pubDate})</span>
				{/if}
			</p>

			{#if item.gndNumber}<a
					class="text-primary-500 underline"
					href={`https://d-nb.info/gnd/${item.gndNumber}`}>See in GND</a
				>
			{/if}
		{/if}
	</div>
</div>
