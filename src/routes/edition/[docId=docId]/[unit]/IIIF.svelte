<script lang="ts">
	let { docId, currentPage } = $props();
</script>

<div class="bg-surface-100-900">
	<h5 class="h5">IIIF</h5>
	<p>{docId}, page: {currentPage}</p>
</div>
