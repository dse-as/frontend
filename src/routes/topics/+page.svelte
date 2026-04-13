<script>
	import { resolve } from '$app/paths';
</script>

<div class="mx-auto mt-13 flex w-full max-w-300 flex-col items-center justify-center">
	<h1 class="h1">Thematische Zugänge</h1>

	<nav class="mt-10">
		<ul class="flex flex-wrap justify-center gap-4">
			<li class="my-btn-round text-2xl"><a href={resolve('/topics/family')}>Familie</a></li>
			<li class="my-btn-round text-2xl"><a href={resolve('/topics/gender')}>Gender</a></li>
			<li class="my-btn-round text-2xl">
				<a href={resolve('/topics/intermediality')}>Intermedialität</a>
			</li>
		</ul>
	</nav>
</div>
