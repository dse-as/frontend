import { selectMark } from './selectMark';
import { selectNote } from './selectNote';
import { scrollToNote } from './scrollToNote';
import { selectedNote } from '$lib/globals/state/ui.svelte';

export function handleMarkClick(ev: MouseEvent) {
	let ids: string[] = [];
	try {
		ids = JSON.parse((ev.target as HTMLElement).dataset.noteids!);
	} catch (error) {
		ids = [(ev.target as HTMLElement).dataset.noteids!];
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
