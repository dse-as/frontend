<script>
	let { url, width = '100', classes = '' } = $props();
</script>

<img
	class={classes}
	style="min-width:{width}px;"
	src={`${url}/full/${width},/0/default.jpg`}
	alt="img"
/>
