<script lang="ts">
	let {
		url,
		iiif_imageAPI_width = 100,
		blur = false,
		classes = ''
	}: {
		url?: string | null | undefined;
		iiif_imageAPI_width?: number;
		blur?: boolean;
		classes?: string;
	} = $props();
	let showSpinner = $state(true);
	let isError = $state(false);

	function adapt_iiif_url(url, iiif_imageAPI_width) {
		if (url.includes('monacensia-digital')) {
			return url;
		} else {
			return `${url}/full/${iiif_imageAPI_width},/0/default.jpg`;
		}
	}
</script>

{#if url}
	{#if showSpinner}
		<div class={['flex items-center justify-center', classes]}>
			<i class="fa-solid fa-spinner fa-spin fa-2xl text-dark-40"></i>
		</div>
	{/if}
	{#if !isError}
		<div class={['overflow-hidden', blur && 'blur-xs']}>
			<img
				class={[
					blur && 'blur-lg',
					showSpinner ? 'hidden' : 'flex',
					'object-cover grayscale-60 hover:grayscale-0',
					classes
				]}
				src={adapt_iiif_url(url, iiif_imageAPI_width)}
				alt="iiif"
				onload={() => {
					showSpinner = false;
				}}
				onerror={() => {
					isError = true;
					showSpinner = false;
				}}
			/>
		</div>
	{:else}
		<div
			class={['flex items-center justify-center', classes]}
			data-url={adapt_iiif_url(url, iiif_imageAPI_width)}
		>
			<i class="fa-solid fa-xmark fa-2xl text-warning"></i>
		</div>
	{/if}
{:else}
	<div class={['flex items-center justify-center', classes]}>
		<i class="fa-solid fa-xmark fa-2xl"></i>
	</div>
{/if}
