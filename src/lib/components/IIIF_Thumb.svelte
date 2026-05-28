<script>
	let { url, maxWidth = '100', maxHeight = '100', classes = '' } = $props();
	const iiif_imageAPI_width = '100';
	let showSpinner = $state(true);
	let isError = $state(false);
</script>

{#if url}
	<img
		class={[
			showSpinner ? 'hidden' : 'flex',
			'h-max w-max items-center justify-center bg-surface-50 object-cover'
		]}
		style={`max-width:${maxWidth}px; max-height:${maxHeight}px;`}
		src={`${url}/full/${iiif_imageAPI_width},/0/default.jpg`}
		alt="iiif"
		onload={() => {
			showSpinner = false;
		}}
		onerror={() => {
			isError = true;
			showSpinner = false;
		}}
	/>
	{#if showSpinner}
		<div
			class={['flex items-center justify-center rounded-xl border', classes]}
			style={`width:${Number(maxWidth) * 0.7}px; height:${maxHeight}px;`}
		>
			<i class="fa-solid fa-spinner fa-spin fa-2xl text-surface-500"></i>
		</div>
	{:else if isError}
		<div
			class={['flex items-center justify-center rounded-xl border', classes]}
			style={`width:${Number(maxWidth) * 0.7}px; height:${maxHeight}px;`}
		>
			<i class="fa-solid fa-xmark fa-2xl text-red-500"></i>
		</div>
	{/if}
{:else}
	<div class={['flex h-full w-full items-center justify-center rounded-xl border', classes]}>
		<i class="fa-solid fa-xmark fa-2xl"></i>
	</div>
{/if}
