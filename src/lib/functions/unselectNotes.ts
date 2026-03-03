export function unselectNotes() {
	const elSpan = document.querySelectorAll(`[data-dom=annotationBox]`);
	elSpan.forEach((el) => {
		el.classList.remove('highlighted');
	});
}
