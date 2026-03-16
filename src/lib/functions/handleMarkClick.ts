import { selectMark } from './selectMark';
import { selectNote } from './selectNote';
import { scrollToNote } from './scrollToNote';
import { selectedNote } from '$lib/globals/state/ui.svelte';

export function handleMarkClick(ev) {
	let ids = [];
	try {
		ids = JSON.parse(ev.target.dataset.noteids);
	} catch (error) {
		ids = [ev.target.dataset.noteids];
	}

	switch (ids.length) {
		case 0:
			return;
		default:
			selectedNote.id = ids[0];
			ids.forEach((id) => {
				selectMark(id);
				selectNote(id);
			});
			scrollToNote(ids[0]);
			break;
	}
}
