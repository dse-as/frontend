<script lang="ts">
	import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
	import type { TSeqSmallformsKeys } from '$lib/types/TSequences';
	import { resolve } from '$app/paths';
	import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
	import DocumentsNav from '$lib/components/DocumentsNav.svelte';

	let seqData = $derived(seqAll.smallforms);
</script>

<!-- Series -->
{#snippet keyList(keys: TSeqSmallformsKeys[])}
	<div class={['preset-btn-list items-center justify-center', '--spacing-sm']}>
		{#each keys as key (key)}
			<a class="preset-btn-round --normal" href={resolve(`/${key}` as any)}
				>{seqData[key as TSeqSmallformsKeys].name}</a
			>
		{/each}
	</div>
{/snippet}

<div class={['z-100 mx-auto flex max-w-300 flex-col gap-10 bg-background px-10']}>
	<!-- Navigation -->
	<DocumentsNav docType="smallforms" />
	<h1 class={['h1 text-center whitespace-nowrap transition-all duration-200']}>
		{dictDoc['smallforms']?.label_plural}
	</h1>

	<div class={['flex flex-col gap-5']}>
		<p>
			‘Kleine Formen’ ist ein Sammelbegriff für Texte, die sich durch Kürze und Abgeschlossenheit
			auszeichnen. Sie können verschiedenen (Misch-)Gattungen oder Graubereichen zwischen Gattungen
			angehören. Kleine Formen sind ein typisches Phänomen der Moderne, insbesondere der modernen
			Publikationsform des Feuilletons, beschränken sich aber nicht auf dieses <span
				class="text-muted-foreground"
			>
				[hier ev. später ein Hyperlink zu einem thematischen Kommentar zum Feuilleton]
			</span>.
		</p>

		<p>
			Die dort betriebene Auflösung von Gattungsgrenzen war bei Annemarie Schwarzenbach oft
			programmatisch: Neben den journalistischen Gattungen der Reise- und Sozialreportage hat sie
			viele Texte verfasst und publiziert, die sich weder eindeutig einer journalistischen oder
			literarischen Form zuordnen lassen. Dieses Spiel findet sich neben dem Feuilleton auch in
			‘normalen’ Zeitungsartikeln, Zeitschriftenartikeln sowie unpublizierten Typo- und
			Manuskripten. Die Edition trägt der von Schwarzenbach bewusst eingesetzten ‘Verschleifung’ der
			Gattungen Rechnung, in dem sie die meisten Zugänge ohne strikte Festlegung auf
			Gattungszugehörigkeiten legt.
		</p>

		<p>
			Von ungefähr 60 Texten liegen sowohl Entwürfe als auch Publikationen vor, diese werden je als
			Einzeldokumente zugänglich gemacht und lassen sich als Textstufen-Sequenz aufrufen.
		</p>
	</div>

	<div class={['flex flex-col gap-25 py-5']}>
		<!-- Chronologie -->
		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Chronologie</h2>
			<p>
				Die Chronologie aller Kleinen Formen musste zuweilen rekonstruiert werden, da im Falle von
				Entwürfen oft nur ein Entstehungszeitraum eruiert werden kann. Die Edition versucht das
				Entstehungsdatum auf einzelne Monate genau zu erfassen. Wo zwei Dokumente im selben Monat
				entstanden sind, werden sie gemäss biographischen und thematischen Erwägungen angeordnet.
			</p>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.keys(seqData).filter((key) => {
						return (key as string) === 'smallforms_all';
					}) as TSeqSmallformsKeys[]
				)}
			</div>
			<p class="text-center text-muted-foreground">(ev. später als Zeitstrahl)</p>
		</div>

		<!-- Dokumentform -->
		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Dokumentform</h2>
			<p>
				Der Zugang aller Kleinen Formen über ihre Dokumentform lässt nur bedingt Rückschlüsse auf
				ihre inhaltliche Ausrichtung zu, (s.o.) ist aber für die Frage medialer Formate zentral. Wir
				unterscheiden zwischen zwei Grundformen: Entwürfe (Typoskript, Manuskript) und publizierte
				Texte (Zeitungsartikel, Zeitschriftenartikel, Feuilleton, Fotoreportage, publizierte
				Fotojournalistische Publikationen, Sammelbandbeiträge). Mit ‘Feuilleton’ ist hier keine
				inhaltliche Gattung, sondern der Publikationsort unter dem Feuilletonstrich gemeint. Jede
				Unterkategorie ist chronologisch geordnet.
			</p>
			<p class="text-center text-muted-foreground">(ev. später als ausklappbare Baumstruktur)</p>

			<h5 class="h5 text-center">Entwürfe</h5>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.entries(seqData)
						.filter(([, val]) => (val.type as string) === 'unpublished')
						.map(([key]) => key as TSeqSmallformsKeys)
				)}
			</div>

			<h5 class="h5 text-center">Publikationen</h5>
			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.entries(seqData)
						.filter(([, val]) => (val.type as string) === 'published')
						.map(([key]) => key as TSeqSmallformsKeys)
				)}
			</div>
		</div>

		<div class="flex flex-col gap-7">
			<h2 class="h2 text-center">Subsets</h2>
			<!-- Periodika und Sammelbände (Subset) -->
			<h2 class="h5 text-center">Periodika und Sammelbände</h2>
			<p>
				Die Zeitungen und Zeitschriften, in denen Annemarie Schwarzenbach Texte und Fotografien
				publiziert hat.
			</p>

			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.entries(seqData)
						.filter(([, val]) => (val.type as string) === 'periodika')
						.map(([key]) => key as TSeqSmallformsKeys)
				)}
			</div>
		</div>

		<!-- Sonderformen der Publikation (Subset) -->
		<div class="flex flex-col gap-7">
			<h2 class="h5 text-center">Sonderformen der Publikation</h2>
			<p>
				Als Sonderformen werden spezielle Publikationsformate verstanden: <em>Serien</em>
				bezeichnen Artikelreihen, die denselben Übertitel tragen. <em>Beilagen</em> bezeichnen nicht-täglich
				erscheinende thematische Ressorts (z.B. Seite der Frau), in denen Schwarzenbachs Texte publiziert
				wurden. Diese Sonderformen können sich mit Dokumentformen überschneiden, ein Text kann z.B. im
				Feuilleton erschienen sein und zugleich Teil einer Artikelreihe darstellen. Jede Unterkategorie
				ist chronologisch geordnet.
			</p>

			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.entries(seqData)
						.filter(([, val]) => (val.type as string) === 'pubseries')
						.map(([key]) => key as TSeqSmallformsKeys)
				)}
			</div>
		</div>

		<!-- Sonderformen der Gattung (Subset) -->
		<div class="flex flex-col gap-7">
			<h2 class="h5 text-center">Sonderformen der Gattung</h2>
			<p>
				Einzelne Kleine Formen Annemarie Schwarzenbachs lassen sich eindeutig einer Gattung zuweisen
				und stellen somit eine Sonderform des ansonsten ‘gattungsschleifenden’ Schreibens
				Schwarzenbach dar. Die relevanten Gattungen sind <em>Rezensionen</em>,
				<em>Lyrik</em>
				und explizite
				<em>Erzähl-Sammlungen</em>. Letztere bestehen aus Texten, die Schwarzenbach für eine ihrer
				beiden, nie publizierten ‘Novellensammlungen’ (Falkenkäfig, Die vierzig Säulen der
				Erinnerung) vorgesehen hat und deshalb eine eindeutige Bezeichnung als erzählende,
				fiktionale Literatur erlauben.
			</p>

			<div class="flex flex-wrap justify-center gap-2">
				{@render keyList(
					Object.entries(seqData)
						.filter(([, val]) => (val.type as string) === 'gattung')
						.map(([key]) => key as TSeqSmallformsKeys)
				)}
			</div>
		</div>
	</div>
</div>
