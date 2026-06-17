<!-- 
 
//! TODO
    - Either display regular 404 page OR
    - redirect to  and insert an alert box on top saying that the requested path does not exist.

-->
<script>
	import { page } from '$app/state';
</script>

<div class="m-10">
	<h1 class="h1">404!</h1>
	<p class="mt-10">{page.error?.message}</p>
</div>
