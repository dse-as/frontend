<script>
	let { url, classes = '' } = $props();
	const iiif_imageAPI_width = '100';
	let showSpinner = $state(true);
	let isError = $state(false);
</script>

{#if url}
	{#if showSpinner}
		<div class={['flex items-center justify-center', classes]}>
			<i class="fa-solid fa-spinner fa-spin fa-2xl text-dark-40"></i>
		</div>
	{/if}
	{#if !isError}
		<img
			class={[
				showSpinner ? 'hidden' : 'flex',
				'object-cover grayscale-60 hover:grayscale-0',
				classes
			]}
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
	{:else}
		<div class={['flex items-center justify-center', classes]}>
			<i class="fa-solid fa-xmark fa-2xl text-warning"></i>
		</div>
	{/if}
{:else}
	<div class={['container-centered', classes]}>
		<i class="fa-solid fa-xmark fa-2xl"></i>
	</div>
{/if}
