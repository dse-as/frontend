<script lang="ts">
	import CETEI from '$lib/CETEIcean/CETEI';
	import { JSDOM } from 'jsdom';

	const jdom = new JSDOM(`<TEI xmlns="http://www.tei-c.org/ns/1.0" />`, {
		contentType: 'text/xml'
	});
	new CETEI({
		documentObject: jdom.window.document
	});
</script>
