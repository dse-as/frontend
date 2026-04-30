import { activeRegisterTab, selectedTextNode } from '$lib/globals/state/ui.svelte';
import { openRegisters } from '$lib/globals/state/ui.svelte';
import type { TEntityTypes, TRegKeys } from '$lib/types/register/TRegister';
import { findRegTypeByRegKey } from '../ease_of_use/findRegTypeByRegKey';

function selectRsNodesInText(key: string) {
	resetAllHighlightsInText(); // Remove old highlights
	const nodes = document.querySelectorAll(`tei-text tei-rs[key=${key}]`);
	nodes.forEach((el) => {
		el.classList.add('active');
	});
}
function activateNoteRef(key: string) {
	resetAllHighlightsInText(); // Remove old highlights
	const footnotesInText = document.querySelectorAll(`tei-text .footnote[data-noteid=${key}]`);
	const marksInText = document.querySelectorAll(`tei-text .note-mark[data-noteid=${key}]`);
	const annotationsInSidebar = document.querySelectorAll(`[data-dom=containerAnnotations] li[data-noteid=${key}]`);
	[...footnotesInText, ...marksInText, ...annotationsInSidebar].forEach((el) => {
		el.classList.add('active');
	});
}

function resetAllHighlightsInText() {
	const nodes = document.querySelectorAll(`tei-text .active, [data-dom=containerAnnotations] .active`);
	nodes.forEach((el) => {
		el.classList.remove('active');
	});
}
function openRegisterSidebar(key: TRegKeys) {
	activeRegisterTab.value = 'register';
	const regType = findRegTypeByRegKey(key);
	if (regType && !openRegisters.list.includes(regType)) {
		openRegisters.list = [...openRegisters.list, regType];
	}
}
function openNoteSidebar() {
	activeRegisterTab.value = 'notes';
}

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

export function clearAllHighlights() {
	selectedTextNode.id = '';
	resetAllHighlightsInText();
}

export function handleRegisterClick(key) {
	if (!key) return;
	selectedTextNode.id = key;
	selectRsNodesInText(key);
	const elSpan = document.querySelector(`[data-textflow=fluid] tei-text tei-rs[key=${key}]`);
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

export function handleAnnotationClick(key) {
	if (!key) return;
	selectedTextNode.id = key;
    activateNoteRef(key);
	const elSpan = document.querySelector(`[data-textflow=fluid] tei-text span.note-mark[data-note-target=${key}]`);
	scrollText(elSpan as HTMLElement);
}

export function handleFootnoteClick(key) {
    if (!key) return;
	selectedTextNode.id = key;
	openNoteSidebar();
    activateNoteRef(key);
    const elSpan = document.querySelector(`[data-dom=containerAnnotations] #${key}`);
	scrollNotes(elSpan);
}
