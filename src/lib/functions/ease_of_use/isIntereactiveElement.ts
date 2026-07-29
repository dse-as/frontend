// Helper to check if the currently focused element is an interactive component
export function isInteractiveElement(element: Element | null): boolean {
	if (!element || element === document.body) return false;

	const tagName = element.tagName.toLowerCase();

	// Common interactive HTML elements
	const interactiveTags = ['button', 'input', 'select', 'textarea', 'a', 'summary'];

	// Check tag name
	if (interactiveTags.includes(tagName)) return true;

	// Check for explicit tabindex (but ignore negative tabindex which removes from tab order)
	const tabIndex = element.getAttribute('tabindex');
	if (tabIndex !== null && parseInt(tabIndex, 10) >= 0) return true;

	// Check for role attributes that imply interactivity (common in UI libraries like bits-ui)
	const role = element.getAttribute('role');
	const interactiveRoles = ['button', 'tab', 'menuitem', 'slider', 'combobox', 'listbox', 'tree'];
	if (role && interactiveRoles.includes(role)) return true;

	return false;
}
