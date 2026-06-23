<script lang="ts">
	import { resolve } from '$app/paths';
	import { dict_docs as dictDocs } from '$lib/dictionaries/dict_docs.json';
</script>

<div class="mx-auto mt-13 flex w-full max-w-300 flex-col items-center justify-center">
	<h1 class="h1">
		Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte,
		Intermedialität, Netzwerke
	</h1>
	<h2 class="mt-0 -rotate-3 text-6xl font-bold text-red-500">Alpha-Version</h2>
	<p class="mt-5 -rotate-3 text-4xl font-bold text-red-500">Work in Progress!</p>
</div>

<div class="mt-25 text-center">
	<h2 class=" h2 mb-5">Shortcuts</h2>

	<h3 class="h3">Dropdown "Texte und Fotografien"</h3>
	<ul class="mt-5 flex flex-col gap-2 text-2xl">
		<li>
			&rarr; <a class="underline" href={resolve('/smallforms')}
				>{dictDocs.smallforms.label_plural}</a
			>
		</li>
		<li>
			&rarr; <a class="underline" href={resolve('/longforms')}>{dictDocs.longforms.label_plural}</a>
		</li>
		<li>
			&rarr; <a class="underline" href={resolve('/letters')}>{dictDocs.letters.label_plural}</a>
		</li>
		<li>
			&rarr; <a class="underline" href={resolve('/photos')}>{dictDocs.photos.label_plural}</a>
		</li>
	</ul>

	<h3 class="h3 mt-15">Dropdown "Zugänge"</h3>
	<ul class="mt-5 flex flex-col gap-2 text-2xl">
		<li>&rarr; <a class="underline" href={resolve('/map')}>Karte</a></li>
		<li>&rarr; <a class="underline" href={resolve('/timeline')}>Zeitstrahl</a></li>
		<li>&rarr; <a class="underline" href={resolve('/network')}>Netzwerk</a></li>
		<li>&rarr; <a class="underline" href={resolve('/topics')}>Themen</a></li>
	</ul>

	<h3 class="h3 mt-15">Dokumente</h3>
	<ul class="mt-5 flex flex-col gap-2 text-2xl">
		<li>
			&rarr; <a class="underline" href={resolve('/smallform_0231')}>Smallform 0231</a>
		</li>
		<li>
			&rarr; <a class="underline" href={resolve('/smallform_0529')}>Smallform 0529</a>
		</li>
	</ul>
</div>
