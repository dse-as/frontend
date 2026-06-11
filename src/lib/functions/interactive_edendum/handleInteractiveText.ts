import { activeRegisterTab, selectedTextNode } from '$lib/globals/ui-states.svelte';
import { openRegisters } from '$lib/globals/ui-states.svelte';
import type { TRegKeysFlat } from '$lib/types/register/TRegister';
import { findRegTypeByRegKey } from '../ease_of_use/findRegTypeByRegKey';

// -------------------------------------------------
// Scroll
// -------------------------------------------------
function scrollContainer(elContainer: HTMLElement | null, elItem: HTMLElement | null) {
	if (!elContainer || !elItem) return;
	const containerRect = elContainer.getBoundingClientRect();
	const refRect = elItem.getBoundingClientRect();
	const targetTop = refRect.top - containerRect.top + elContainer.scrollTop;

	elContainer.scrollTo({
		left: elContainer.scrollLeft, // Keep horizontal scroll as is
		top: targetTop,
		behavior: 'smooth'
	});
}
function scrollWindow(elItem: HTMLElement | null) {
	if (!elItem) return;

	const refRect = elItem.getBoundingClientRect();

	// Calculate the absolute scroll position needed
	// We add window.scrollY to get the absolute position in the document
	const targetTop = refRect.top + window.scrollY - 100;

	window.scrollTo({
		left: window.scrollX, // Keep horizontal scroll as is
		top: targetTop,
		behavior: 'smooth'
	});
}

// -------------------------------------------------
// Handle Clicks and Sidebar
// -------------------------------------------------

// Reset .active Nodes
function resetAllActiveNodesInText() {
	const nodes = document.querySelectorAll(
		`tei-text .active, [data-dom=containerAnnotations] .active`
	);
	nodes.forEach((el) => {
		el.classList.remove('active');
	});
}

// Referencing Strings (tei-rs)
function selectAllRsNodesInText(key: TRegKeysFlat) {
	resetAllActiveNodesInText(); // Remove old highlights
	const nodes = document.querySelectorAll(`tei-text tei-rs[key=${key}]`);
	nodes.forEach((el) => {
		el.classList.add('active');
	});
}

// Notes (.note-mark, .footnote)
function activateNoteInText(key: string) {
	resetAllActiveNodesInText(); // Remove old highlights
	const footnotesInText = document.querySelectorAll(`tei-text .footnote[data-noteid=${key}]`);
	const marksInText = document.querySelectorAll(`tei-text .note-mark[data-noteid=${key}]`);
	const annotationsInSidebar = document.querySelectorAll(
		`[data-dom=containerAnnotations] li[data-noteid=${key}]`
	);
	[...footnotesInText, ...marksInText, ...annotationsInSidebar].forEach((el) => {
		el.classList.add('active');
	});

	// focus first mark
	(marksInText[0] as HTMLElement).focus();
}

// Open Sidebar
function openRegisterSidebar(key: TRegKeysFlat) {
	activeRegisterTab.value = 'register';
	const regType = findRegTypeByRegKey(key);
	if (regType && !openRegisters.list.includes(regType)) {
		openRegisters.list = [...openRegisters.list, regType];
	}
}
function openNoteSidebar() {
	activeRegisterTab.value = 'notes';
}

// Scroll Text and Sidebar
function scrollText(elItem: HTMLElement) {
	scrollWindow(elItem);
}
function scrollRegister(elItem: HTMLElement) {
	const elContainer = document.querySelector('[data-dom=containerRegister]');
	scrollContainer(elContainer as HTMLElement, elItem);
}
function scrollNotes(elItem: HTMLElement) {
	const elContainer = document.querySelector('[data-dom=containerAnnotations]');
	scrollContainer(elContainer as HTMLElement, elItem);
}


function resetRegister() {
	const nodes = document.querySelectorAll('[data-dom=containerRegister] [data-active]');
	nodes.forEach((el) => {
		el.removeAttribute('data-active')
	});
}

function activateRegister(regElement:HTMLElement) {
	resetRegister();
	regElement.setAttribute('data-active','active');
}

// Exports
export function clearAllHighlights() {
	selectedTextNode.id = '';
	resetAllActiveNodesInText();
	resetRegister();
}

export function handleRegisterClick(
	key: TRegKeysFlat | undefined | null
) {
	if (!key) return;
	const regElement = document.querySelector(`[data-dom=containerRegister] [data-regkey=${key}]`);
	activateRegister(regElement as HTMLElement);
	selectedTextNode.id = key;
	selectAllRsNodesInText(key);
	const nodeList = document.querySelectorAll(`[data-textflow=fluid] tei-text tei-rs[key=${key}]`);
	const elSpans = Array.from(nodeList).filter((el): el is HTMLElement => el instanceof HTMLElement);
	selectedTextNode.el = elSpans[0];
	selectedTextNode.els = elSpans;

	// focus first element and scroll
	elSpans[0].focus();
	scrollText(elSpans[0] as HTMLElement);
}

export function handleScrollToSibling(key: TRegKeysFlat, direction: 'next' | 'prev'): void {
	const nodeList = document.querySelectorAll(`[data-textflow=fluid] tei-text tei-rs[key=${key}]`);
	const elSpans = Array.from(nodeList).filter((el): el is HTMLElement => el instanceof HTMLElement);
	if (!elSpans || !selectedTextNode.el) return;

	let currentIndex = -1;

	// Find the index of the currently selected element
	for (let i = 0; i < elSpans.length; i++) {
		if (elSpans[i] === selectedTextNode.el) {
			currentIndex = i;
			break;
		}
	}

	// If the current element wasn't found in the list, do nothing
	if (currentIndex === -1) return;

	const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

	// Check if the calculated index is within bounds
	if (newIndex >= 0 && newIndex < elSpans.length) {
		selectedTextNode.el = elSpans[newIndex];
		scrollText(selectedTextNode.el as HTMLElement);
	}
	// Wrap around logic: if next index is out of bounds, go to the opposite end
	else if (direction === 'prev' && currentIndex === 0) {
		selectedTextNode.el = elSpans[elSpans.length - 1];
		scrollText(selectedTextNode.el as HTMLElement);
	} else if (direction === 'next' && currentIndex === elSpans.length - 1) {
		selectedTextNode.el = elSpans[0];
		scrollText(selectedTextNode.el as HTMLElement);
	}
	resetAllActiveNodesInText();
	selectedTextNode.el.classList.add('active');
}

export function handleAnnotationClick(noteId: string | undefined | null) {
	if (!noteId) return;
	selectedTextNode.id = noteId;
	activateNoteInText(noteId);
	const elSpan = document.querySelector(
		`[data-textflow=fluid] tei-text span.note-mark[data-noteid=${noteId}]`
	);
	scrollText(elSpan as HTMLElement);
}

export function handleRefStringClick(elSpan: HTMLElement | undefined | null) {
	const key = elSpan?.getAttribute('key') as TRegKeysFlat;
	if (!elSpan || !key) return;
	selectedTextNode.id = key;
	selectedTextNode.el = elSpan as HTMLElement;
	const nodeList = document.querySelectorAll(`[data-textflow=fluid] tei-text tei-rs[key=${key}]`);
	const elSpans = Array.from(nodeList).filter((el): el is HTMLElement => el instanceof HTMLElement);
	selectedTextNode.els = elSpans;
	
	// render active
	resetAllActiveNodesInText();
	elSpan.classList.add('active');

	openRegisterSidebar(key);
	const regElement = document.querySelector(`[data-dom=containerRegister] [data-regkey=${key}]`);
	scrollRegister(regElement as HTMLElement);
	activateRegister(regElement as HTMLElement);
}
export function handleFootnoteClick(key: string | undefined | null) {
	if (!key) return;
	selectedTextNode.id = key;
	openNoteSidebar();
	activateNoteInText(key);
	const annotElement = document.querySelector(
		`[data-dom=containerAnnotations] li[data-noteid=${key}]`
	);
	scrollNotes(annotElement as HTMLElement);
}
