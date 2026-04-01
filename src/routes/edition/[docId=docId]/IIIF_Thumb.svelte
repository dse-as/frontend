<script>
	let { url, minSize = '100', classes = '' } = $props();
	let isLoading = $state(true);
</script>

{#if url}
	{#if isLoading}
		<div class="flex h-full w-full items-center justify-center rounded-xl border">
			<i class="fa-solid fa-spinner fa-spin fa-2xl text-surface-500"></i>
		</div>
	{:else}
		<img
			class={`flex h-auto w-full items-center justify-center bg-surface-50 min-w-[${minSize}px] min-h-[${minSize}px] max-h-full max-w-full object-cover`}
			src={`${url}/full/${minSize},/0/default.jpg`}
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
	src={`${url}/full/${minSize},/0/default.jpg`}
	onload={() => {
		isLoading = false;
	}}
/>
