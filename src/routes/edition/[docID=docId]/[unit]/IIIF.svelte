<script lang="ts">
	let { docID, currentPage } = $props();
</script>

<div class="bg-surface-300-700">
	<h5 class="h5">IIIF</h5>
	<p>{docID}, page: {currentPage}</p>
</div>
