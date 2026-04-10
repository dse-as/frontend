<script>
	let { children } = $props();
</script>

{@render children()}

<style lang="postcss">
	/* Global Styles for the blog */
	:global(h1) {
		font-size: xx-large;
	}
	:global(h2) {
		font-size: x-large;
	}
	:global(h3) {
		font-size: large;
	}
</style>
