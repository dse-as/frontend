<!-- 
 
//!TODO
    - Display alert for inexisting unit
    - Redirect to first unit

-->
<script>
	import { page } from '$app/state';
</script>

<p>ERROR IN EDITION: {page.params.docId}</p>
<p>{page.error?.message}</p>
