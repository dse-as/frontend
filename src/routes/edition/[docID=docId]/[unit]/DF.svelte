<script lang="ts">
	import IIIF from './IIIF.svelte';
	import TextPaged from './TextPaged.svelte';
</script>

<div class="h-full w-full bg-surface-800-200 text-surface-200-800">
	<h1 class="h1">DF</h1>
	<div class="grid grid-cols-2">
		<IIIF />
		<TextPaged />
	</div>
</div>
