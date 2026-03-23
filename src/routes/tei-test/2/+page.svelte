<script lang="ts">
	import CETEI from '$lib/CETEIcean/CETEI';
	import { onMount } from 'svelte';

	onMount(() => {
		var CETEIcean = new CETEI();
		CETEIcean.getHTML5('/test-tei/smallform_0231.xml', (data) => {
			document.getElementById('TEI').appendChild(data);
		});
	});
</script>

<div id="TEI"></div>
