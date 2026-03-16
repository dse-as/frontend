<script>
	let { iiif_url, size = '100' } = $props();
</script>

<img src={`${iiif_url}/full/${size},/0/default.jpg`} alt="img" />
