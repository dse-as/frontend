<script>
	import { resolve } from '$app/paths';
</script>

<div class="mx-auto mt-13 flex w-full max-w-300 flex-col items-center justify-center">
	<h1 class="h1">Projektteam</h1>
	<ul>
		<li>Person 1</li>
		<li>Person 2</li>
		<li>Person 3</li>
		<li>Person 4</li>
	</ul>
	<h1 class="h1">Publikationen</h1>
	<h1 class="h1">Documentation</h1>
	<ul>
		<li><a href={resolve('/project/docs')}>Dokumentation 1</a></li>
		<li><a href={resolve('/project/docs')}>Dokumentation 2</a></li>
		<li><a href={resolve('/project/docs')}>Dokumentation 3</a></li>
		<li><a href={resolve('/project/docs')}>Dokumentation 4</a></li>
	</ul>
</div>
