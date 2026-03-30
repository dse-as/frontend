<script>
	let { url, minSize = '100', classes = '' } = $props();
</script>

<!-- <img class={classes} style="min-width:{minSize}px;" src="/logos/logo-dsl.png" alt="img" /> -->
<img
	class={[classes, 'flex items-center justify-center bg-surface-100-900']}
	style="min-width:{minSize}px; min-height:{minSize}px;"
	src={`${url}/full/${minSize},/0/default.jpg`}
	alt="iiif"
/>
