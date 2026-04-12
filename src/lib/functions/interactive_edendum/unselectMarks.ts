export function unselectMarks() {
	const elSpan = document.querySelectorAll(`span[data-type=mark], span[data-type=markend]`);
	elSpan.forEach((el) => {
		el.classList.remove('highlighted');
	});
}
