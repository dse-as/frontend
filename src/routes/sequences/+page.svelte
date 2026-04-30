<script>
	import { resolve } from '$app/paths';
</script>

<div class="mx-auto mt-13 flex w-full max-w-300 flex-col items-center justify-center">
	<h1 class="h1">Sequenzen</h1>
	<nav class="mt-10">
		<ul class="flex flex-wrap gap-4">
			<li class="my-btn-round text-2xl">
				<a href={resolve('/sequences/textstufen')}>Textstufen</a>
			</li>
			<li class="my-btn-round text-2xl"><a href={resolve('/sequences/series')}>Serien</a></li>
			<li class="my-btn-round text-2xl"><a href={resolve('/sequences/travels')}>Reisen</a></li>
		</ul>
	</nav>
</div>
