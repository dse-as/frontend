import { unselectMarks } from './unselectMarks';

export function selectMark(id) {
	unselectMarks(); // Remove old highlights
	const elSpan = document.querySelectorAll(
		`span[data-type=mark][data-noteids*=${id}], span[data-type=markend][data-noteid=${id}]`
	);
	elSpan.forEach((el) => {
		el.classList.add('highlighted');
	});
}
