import { activeRegisterTab, selectedTextNode } from '$lib/globals/state/ui.svelte';
import { openRegisters } from '$lib/globals/state/ui.svelte';
import type { TRegKeysFlat } from '$lib/types/register/TRegister';
import { findRegTypeByRegKey } from '../ease_of_use/findRegTypeByRegKey';

// -------------------------------------------------
// Scroll
// -------------------------------------------------
function scroll(elContainer: HTMLElement | null, elItem: HTMLElement | null) {
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
function activateNoteInText(noteid: string) {
	resetAllActiveNodesInText(); // Remove old highlights
	const footnotesInText = document.querySelectorAll(`tei-text .footnote[data-noteid=${noteid}]`);
	const marksInText = document.querySelectorAll(`tei-text .note-mark[data-noteid=${noteid}]`);
	const annotationsInSidebar = document.querySelectorAll(
		`[data-dom=containerAnnotations] li[data-noteid=${noteid}]`
	);
	[...footnotesInText, ...marksInText, ...annotationsInSidebar].forEach((el) => {
		el.classList.add('active');
	});
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
	const elContainer = document.querySelector('[data-textflow=fluid]');
	scroll(elContainer as HTMLElement, elItem);
}
function scrollRegister(elItem: HTMLElement) {
	const elContainer = document.querySelector('[data-dom=containerRegister]');
	scroll(elContainer as HTMLElement, elItem);
}
function scrollNotes(elItem: HTMLElement) {
	const elContainer = document.querySelector('[data-dom=containerAnnotations]');
	scroll(elContainer as HTMLElement, elItem);
}

// Exports
export function clearAllHighlights() {
	selectedTextNode.id = '';
	resetAllActiveNodesInText();
}

export function handleRegisterClick(key: TRegKeysFlat | undefined | null) {
	if (!key) return;
	selectedTextNode.id = key;
	selectAllRsNodesInText(key);
	const elSpan = document.querySelector(`[data-textflow=fluid] tei-text tei-rs[key=${key}]`);
	scrollText(elSpan as HTMLElement);
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

export function handleRefStringClick(key: TRegKeysFlat | undefined | null) {
	if (!key) return;
	selectedTextNode.id = key;
	selectAllRsNodesInText(key);
	openRegisterSidebar(key);
	const elSpan = document.querySelector(`[data-dom=containerRegister] [data-regkey=${key}]`);
	scrollRegister(elSpan as HTMLElement);
}
export function handleFootnoteClick(noteId: string | undefined | null) {
	if (!noteId) return;
	selectedTextNode.id = noteId;
	openNoteSidebar();
	activateNoteInText(noteId);
	const elSpan = document.querySelector(
		`[data-dom=containerAnnotations] li[data-noteid=${noteId}]`
	);
	scrollNotes(elSpan as HTMLElement);
}
