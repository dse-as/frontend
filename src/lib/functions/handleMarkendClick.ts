import { selectMark } from './selectMark';
import { selectNote } from './selectNote';
import { scrollToNote } from './scrollToNote';
import { selectedNote } from '$lib/globals/state/ui.svelte';

export function handleMarkendClick(ev: MouseEvent) {
	const target = (ev.target as HTMLElement)?.closest<HTMLElement>('[data-noteid]');
	const id = target?.dataset.noteid ?? '';
	if (id) {
		selectedNote.id = id;
		selectMark(id);
		selectNote(id);
		scrollToNote(id);
	}
}
