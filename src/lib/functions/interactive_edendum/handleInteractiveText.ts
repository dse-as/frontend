import { activeRegisterTab, selectedTextNode } from '$lib/globals/state/ui.svelte';
import { openRegisters } from '$lib/globals/state/ui.svelte';
import type { TEntityTypes, TRegKeys } from '$lib/types/register/TRegister';
import { findRegTypeByRegKey } from '../ease_of_use/findRegTypeByRegKey';

function selectRsNodesInText(key: string) {
	unselectAllHighlightsInText(); // Remove old highlights
	const nodes = document.querySelectorAll(`tei-text tei-rs[key=${key}]`);
	nodes.forEach((el) => {
		el.classList.add('highlighted');
	});
}
function selectNoteRefInText(noteId: string) {
	unselectAllHighlightsInText(); // Remove old highlights
	const nodes = document.querySelectorAll(`tei-text tei-note[id=${noteId}], span[data-type=mark][data-noteids*=${noteId}], span[data-type=markend][data-noteid=${noteId}]`);
	nodes.forEach((el) => {
		el.classList.add('highlighted');
	});
}
export function clearAllHighlights() {
	selectedTextNode.id = '';
	unselectAllHighlightsInText();
}
function unselectAllHighlightsInText() {
	const nodes = document.querySelectorAll(`tei-text .highlighted`);
	nodes.forEach((el) => {
		el.classList.remove('highlighted');
	});
}
function openRegisterSidebar(key: TRegKeys) {
	activeRegisterTab.value = 'register';
	const regType = findRegTypeByRegKey(key);
	if (regType && !openRegisters.list.includes(regType)) {
		openRegisters.list = [...openRegisters.list, regType];
	}
}
function openNoteSidebar(key: TRegKeys) {
	activeRegisterTab.value = 'notes';
}

function scroll(elContainer: HTMLElement | null, elItem: HTMLElement | null) {
	if (!elContainer || !elItem) return;
    console.log(elItem)
	const containerRect = elContainer.getBoundingClientRect();
	const refRect = elItem.getBoundingClientRect();
	const targetTop = refRect.top - containerRect.top + elContainer.scrollTop;

	elContainer.scrollTo({
		left: elContainer.scrollLeft, // Keep horizontal scroll as is
		top: targetTop,
		behavior: 'smooth'
	});
}

function scrollRegister(elItem: HTMLElement) {
	const elContainer = document.querySelector('[data-dom=containerRegister]');
	scroll(elContainer as HTMLElement, elItem);
}
function scrollNotes(elItem: HTMLElement) {
	const elContainer = document.querySelector('[data-dom=containerAnnotations]');
	scroll(elContainer as HTMLElement, elItem);
}

function scrollText(elItem: HTMLElement) {
	const elContainer = document.querySelector('[data-textflow=fluid]');
	scroll(elContainer as HTMLElement, elItem);
}

export function handleRegisterClick(key) {
	if (!key) return;
	selectedTextNode.id = key;
	selectRsNodesInText(key);
	const elSpan = document.querySelectorAll(`[data-textflow=fluid] tei-text tei-rs[key=${key}]`)[0];
	scrollText(elSpan as HTMLElement);
}

export function handleRsClick(key) {
	if (!key) return;
	selectedTextNode.id = key;
	selectRsNodesInText(key);
	openRegisterSidebar(key);
	const elSpan = document.querySelector(`[data-dom=containerRegister] [data-regkey=${key}]`);
	scrollRegister(elSpan as HTMLElement);
}

export function handleFootnoteClick(noteId) {
    console.log(noteId)
    if (!noteId) return;
	selectedTextNode.id = noteId;
    selectNoteRefInText(noteId);
    const elSpan = document.querySelector(`[data-dom=containerAnnotations] #${noteId}`);
    console.log(elSpan)
	scrollNotes(elSpan);
}
