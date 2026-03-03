import { selectMark } from './selectMark';
import { selectNote } from './selectNote';
import { scrollToMark } from './scrollToMark';

export function handleNoteClick(id) {
	selectNote(id);
	selectMark(id);
	// scrollToMark(id);
}
