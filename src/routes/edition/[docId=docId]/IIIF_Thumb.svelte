<script>
	let { url, minWidth = '50', minHeight = '80', classes = '' } = $props();
	let isLoading = $state(true);
</script>

{#if url}
	{#if isLoading}
		<div
			class="flex h-full w-full items-center justify-center rounded-xl border"
			style={`min-width:${minWidth}px; min-height:${minWidth}px;`}
		>
			<i class="fa-solid fa-spinner fa-spin fa-2xl text-surface-500"></i>
		</div>
	{:else}
		<img
			class={`flex h-auto max-h-full w-full max-w-full items-center justify-center bg-surface-50 object-cover`}
			style={`min-width:${minWidth}px; min-height:${minWidth}px;`}
			src={`${url}/full/${Math.max(Number(minWidth), Number(minHeight))},/0/default.jpg`}
			alt="iiif"
		/>
	{/if}
{:else}
	<div class="flex h-full w-full items-center justify-center rounded-xl border">
		<i class="fa-solid fa-xmark fa-2xl"></i>
	</div>
{/if}

<img
	class={`hidden`}
	src={`${url}/full/${Math.max(Number(minWidth), Number(minHeight))},/0/default.jpg`}
	alt="hidden (just for loading)"
	onload={() => {
		isLoading = false;
	}}
/>
