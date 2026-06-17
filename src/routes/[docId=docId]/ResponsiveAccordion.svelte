<script>
	import { Accordion } from 'bits-ui';
	import { tick } from 'svelte';

	let isExpanded = $state(false);
	let buttonIsSticky = $state(false);

	const toggleExpandableBox = async () => {
		isExpanded = !isExpanded;
		await tick();
		updateSticky();
	};
	function updateSticky() {
		const parentElement = document.getElementById('expandableBox');
		if (!parentElement) return;

		const rect = parentElement.getBoundingClientRect();

		// If bottom is below viewport → stick to viewport
		buttonIsSticky = rect.bottom >= window.innerHeight;
	}

	$effect(() => {
		// Run once on mount
		updateSticky();

		// Listen to scroll + resize (important!)
		window.addEventListener('scroll', updateSticky);
		window.addEventListener('resize', updateSticky);

		return () => {
			window.removeEventListener('scroll', updateSticky);
			window.removeEventListener('resize', updateSticky);
		};
	});

	const {
		titleOverview = 'Überblickskommentar',
		titleMeta = 'Metadaten',
		overviewContent,
		metadataContent
	} = $props();
</script>

<div class="flex flex-col gap-6">
	<!-- ------------------------------------------------------ -->
	<!-- Desktop View: Expandable side-by-side layout with gradient and open/close button -->
	<!-- ------------------------------------------------------ -->
	<div id="expandableBox" class="relative mt-5 mb-20 hidden pt-5 pb-0 xl:block">
		<div
			class={[
				'grid overflow-hidden transition-all duration-400 ease-in-out',
				isExpanded ? 'max-h-[80vh]' : 'max-h-[145px]'
			]}
		>
			<div class="grid h-full grid-cols-2 items-start gap-20 overflow-hidden">
				<div class="h-full overflow-hidden">
					<h5 class="h5 mb-6 font-bold">{titleOverview}</h5>
					{@render overviewContent()}
				</div>
				<div class="h-full overflow-hidden">
					<h5 class="h5 mb-6 font-bold">{titleMeta}</h5>
					{@render metadataContent()}
				</div>
			</div>
		</div>

		<!-- Gradient -->
		{#if !isExpanded}
			<button
				class="hiddend absolute right-0 bottom-0 left-0 h-8/10 bg-linear-to-t from-background to-transparent xl:block"
				aria-label="expand box"
				onclick={toggleExpandableBox}
			></button>
		{/if}

		<!-- Button to Open/Close -->
		<div
			class={[
				buttonIsSticky ? 'fixed bottom-5' : 'absolute -bottom-10',
				'left-1/2 -translate-x-1/2',
				'hidden xl:block'
			]}
		>
			<button
				class="preset-btn-circle --color-dark --lg"
				aria-label="expand box"
				onclick={toggleExpandableBox}
			>
				<i class={['fa-solid', isExpanded ? 'fa-chevron-up' : 'fa-chevron-down']}></i>
			</button>
		</div>
	</div>

	<!-- ------------------------------------------------------ -->
	<!-- Mobile View: Independent Accordions -->
	<!-- ------------------------------------------------------ -->
	<div class="mt-10 flex flex-col gap-4 xl:hidden">
		<!-- Overview Accordion -->
		<Accordion.Root type="single" class="w-full rounded-card border border-dark-40 shadow-sm">
			<Accordion.Item value="overview-item">
				<Accordion.Trigger
					class="group flex w-full justify-between rounded-card p-4 text-left hover:bg-background-hover focus:ring-2 focus:outline-none data-[state=open]:rounded-b-none data-[state=open]:bg-background-hover"
				>
					<span class="font text-lg font-bold">{titleOverview}</span>
					<span class="duration-50 group-data-[state=open]:rotate-90">
						<i class={['fa-solid fa-chevron-right']}></i>
					</span>
				</Accordion.Trigger>

				<Accordion.Content
					class="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px]"
				>
					<div class="p-4">
						{@render overviewContent()}
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>

		<!-- Metadata Accordion -->
		<Accordion.Root type="single" class="w-full rounded-card border border-dark-40 shadow-sm">
			<Accordion.Item value="meta-item">
				<Accordion.Trigger
					class="group flex w-full justify-between rounded-card p-4 text-left hover:bg-background-hover focus:ring-2 focus:outline-none data-[state=open]:rounded-b-none data-[state=open]:bg-background-hover"
				>
					<span class="font text-lg font-bold">{titleMeta}</span>
					<span class="duration-50 group-data-[state=open]:rotate-90">
						<i class={['fa-solid fa-chevron-right']}></i>
					</span>
				</Accordion.Trigger>

				<Accordion.Content
					class="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px]"
				>
					<div class="p-4">
						{@render metadataContent()}
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</div>
