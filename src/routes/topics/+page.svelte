<script>
	import { resolve } from '$app/paths';
</script>

<h1 class="h1">Thematische Zugänge</h1>

<nav class="mt-2">
	<ul class="flex flex-wrap gap-2">
		<li class="my-btn-round"><a href={resolve('/topics/family')}>Familie</a></li>
		<li class="my-btn-round"><a href={resolve('/topics/gender')}>Gender</a></li>
		<li class="my-btn-round">
			<a href={resolve('/topics/intermediality')}>Intermedialität</a>
		</li>
	</ul>
</nav>
