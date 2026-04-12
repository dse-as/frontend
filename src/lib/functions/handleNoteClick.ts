import { selectMark } from './selectMark';
import { selectNote } from './selectNote';

export function handleNoteClick(id: string) {
	selectNote(id);
	selectMark(id);
	// scrollToMark(id);
}
