import { selectMark } from './selectMark';
import { selectNote } from './selectNote';
import { scrollToNote } from './scrollToNote';
import { selectedNote } from '$lib/globals/state/ui.svelte';

export function handleMarkendClick(ev) {
	let id = "";
	try {
		id = ev.target.dataset.noteid;
	} catch (error) {
		id = ev.target.dataset.noteid;
	}

	console.log('me-id', id)
		if (id){
			selectedNote.id = id;
            selectMark(id);
            selectNote(id);
			scrollToNote(id);
	}
}
