export function scrollToMark(id: string) {
	const elContainer = document.querySelector('[data-dom=containerMaintext]');
	const elNoteRef = document.querySelector<HTMLElement>(`[data-type=markstart][data-noteid=${id}]`);

	if (!elContainer || !elNoteRef) return;
	// Scroll to note
	elContainer.scrollTo({
		left: elContainer.scrollLeft,
		top: elNoteRef.offsetTop,
		behavior: 'smooth'
	});
}
