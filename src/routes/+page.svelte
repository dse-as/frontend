<script>
	import { resolve } from '$app/paths';
</script>

<div class="mx-20">
	<div class="mx-auto mt-13 flex w-full max-w-300 flex-col items-center justify-center">
		<h1 class="h1">
			Annemarie Schwarzenbach: Digitale Edition der Kleinen Formen und Briefe. Reisetexte,
			Intermedialität, Netzwerke
		</h1>
		<h2 class="mt-25 -rotate-3 text-6xl font-bold text-red-500">Alpha-Version</h2>
		<p class="mt-5 -rotate-3 text-4xl font-bold text-red-500">Work in Progress!</p>
	</div>

	<div class="mx-auto mt-43 flex w-full max-w-300 flex-col gap-4 overflow-hidden border-2 p-10">
		<h4 class="h4">Folgende zwei Dokumente existieren in einer Voransicht:</h4>
		<div class="preset-btn-list --spacing-normal">
			<a href={resolve('/smallform_0231')} class="preset-btn-round --lg"
				>Smallform 0231 (Kleine Begegnungen in Danzig)</a
			>
			<a href={resolve('/smallform_0529')} class="preset-btn-round --lg"
				>Smallform 0529 (Schweizer Pionierarbeit)</a
			>
		</div>
	</div>
</div>
