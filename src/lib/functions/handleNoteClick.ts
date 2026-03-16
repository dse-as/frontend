import { selectMark } from './selectMark';
import { selectNote } from './selectNote';

export function handleNoteClick(id) {
	selectNote(id);
	selectMark(id);
	// scrollToMark(id);
}
