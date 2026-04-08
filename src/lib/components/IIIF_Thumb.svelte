<script>
	let { url, maxWidth = '100', maxHeight = '100', classes = '' } = $props();
	const iiif_imageAPI_width = '100';
	let isLoading = $state(true);
	let loadedWithError = $state(false);
</script>

{#if url}
	{#if isLoading}
		<div
			class="flex items-center justify-center rounded-xl border"
			style={`width:${Number(maxWidth) * 0.7}px; height:${maxHeight}px;`}
		>
			<i class="fa-solid fa-spinner fa-spin fa-2xl text-surface-500"></i>
		</div>
	{:else if loadedWithError}
		<div
			class="flex items-center justify-center rounded-xl border"
			style={`width:${Number(maxWidth) * 0.7}px; height:${maxHeight}px;`}
		>
			<i class="fa-solid fa-xmark fa-2xl text-red-500"></i>
		</div>
	{:else}
		<img
			class={`flex h-max w-max items-center justify-center bg-surface-50 object-cover`}
			style={`max-width:${maxWidth}px; max-height:${maxHeight}px;`}
			src={`${url}/full/${iiif_imageAPI_width},/0/default.jpg`}
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
	src={`${url}/full/${iiif_imageAPI_width},/0/default.jpg`}
	alt="hidden (just for loading)"
	onload={() => {
		isLoading = false;
		loadedWithError = false;
	}}
	onerror={() => (loadedWithError = true)}
/>
