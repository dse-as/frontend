<script>
	import { resolve } from '$app/paths';
</script>

<h1 class="h1">Sequenzen</h1>
<p>
	Vorgesehen ist hier eigentlich ein Reiter "Themen", aber für diesen Mockup sind hier mal alle
	sequenzierbaren Listen zusammengestellt.
</p>

<h2 class="mt-10 h2">Publikationskontexte</h2>
<nav class="mt-2">
	<ul class="flex flex-wrap gap-2">
		<li class="my-btn-round"><a href={resolve('/topics/textstufen')}>Textstufen</a></li>
		<li class="my-btn-round"><a href={resolve('/topics/series')}>Serien</a></li>
		<li class="my-btn-round"><a href={resolve('/topics/travels')}>Reisen</a></li>
	</ul>
</nav>
<h2 class="mt-10 h2">Korrespondenzen</h2>
<nav class="mt-2">
	<ul class="flex flex-wrap gap-2">
		<li class="my-btn-round">
			<a href={resolve('/topics/correspondence')}>Korrespondenzen/Briefe</a>
		</li>
		<li class="my-btn-round"><a href={resolve('/topics/hotelbriefe')}>Hotelbriefe</a></li>
	</ul>
</nav>

<h2 class="mt-10 h2">Thematisch</h2>
<nav class="mt-2">
	<ul class="flex flex-wrap gap-2">
		<li class="my-btn-round"><a href={resolve('/topics/family')}>Familie</a></li>
		<li class="my-btn-round"><a href={resolve('/topics/gender')}>Gender</a></li>
		<li class="my-btn-round">
			<a href={resolve('/topics/intermediality')}>Intermedialität</a>
		</li>
	</ul>
</nav>
