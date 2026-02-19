<!-- 
 
//!TODO
    - Either display regular 404 page OR
    - redirect to /edition and insert an alert box on top saying that the requested path does not exist.

-->
<script>
	import { page } from '$app/state';
</script>

<p>ERROR IN EDITION: {page.params.docId}</p>
<p>{page.error?.message}</p>
