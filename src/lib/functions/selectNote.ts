import { scrollToNote } from './scrollToNote';
import { unselectNotes } from './unselectNotes';

export function selectNote(id) {
    unselectNotes(); // Remove old highlights
    const elSpan = document.querySelectorAll(`[data-dom=annotationBox][data-noteid=${id}]`);
    elSpan.forEach((el) => {
        el.classList.add('highlighted');
        scrollToNote(id)
    });
}
