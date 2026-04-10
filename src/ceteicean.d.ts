declare module 'CETEIcean' {
	/**
	 * A behavior value can be:
	 * - A function that receives the element and returns content to append
	 * - An array of 1-2 template strings (before/after wrappers), e.g. `["<em>", "</em>"]`
	 * - An array of CSS-selector/behavior pairs for conditional matching,
	 *   e.g. `[[selector, behaviorValue], ...]`
	 * - An empty array (no-op)
	 */
	type BehaviorValue =
		| ((this: CETEIUtilities, elt: Element) => Node | void)
		| string[]
		| Array<[string | string[], BehaviorValue]>
		| [];

	/** Namespace-prefixed behavior definitions, keyed by element local name. */
	type BehaviorSet = Record<string, BehaviorValue>;

	/**
	 * The object shape accepted by `addBehaviors()`.
	 *
	 * Top-level keys are namespace prefixes (e.g. `"tei"`) mapped to behavior sets.
	 * Two special keys are recognized:
	 * - `namespaces`: maps namespace URIs to prefixes
	 * - `functions`: custom utility functions added to `this.utilities`
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface BehaviorsObject extends Record<string, BehaviorSet | Record<string, string> | Record<string, (...args: any[]) => any> | undefined> {
		/** Map namespace URIs to prefixes. */
		namespaces?: Record<string, string>;
		/** Custom utility functions to attach to `this.utilities`. */
		functions?: Record<string, (this: CETEIUtilities, ...args: any[]) => any>;
	}

	/** Constructor options for CETEI. */
	interface CETEIOptions {
		/** A DOM Document object (e.g. from JSDOM) to use instead of `window.document`. */
		documentObject?: Document;
		/** Base URL for resolving relative links in the XML source. */
		base?: string;
		/** If `true`, enables debug logging (e.g. custom element registration errors). */
		debug?: boolean;
		/** If `true`, discards original element content when applying behaviors. */
		discardContent?: boolean;
		/** If `true`, skips saving/restoring scroll position via URL fragment. */
		ignoreFragmentId?: boolean;
		/** If `true`, skips adding the default TEI behaviors. */
		omitDefaultBehaviors?: boolean;
	}

	/** Utility methods available on `this` inside behavior functions and via `CETEI.utilities`. */
	interface CETEIUtilities {
		getOrdinality(elt: Element, name?: string): number;
		copyAndReset(node: Node): Node;
		first(urls: string): string;
		hideContent(elt: Element, rewriteIds?: boolean): void;
		normalizeURI(urls: string): string;
		repeat(str: string, times: number): string;
		resolveURI(uri: string): string;
		getPrefixDef(prefix: string): { matchPattern: string; replacementPattern: string } | undefined;
		rw(url: string): string;
		resetAndSerialize(el: Element, stripElt?: boolean, ws?: string): string;
		serialize(el: Element | Document | DocumentFragment, stripElt?: boolean, ws?: string): string;
		serializeHTML(el: Element | Document | DocumentFragment, stripElt?: boolean, ws?: string): string;
		unEscapeEntities(str: string): string;
		tagName(name: string): string;
		defineCustomElement(name: string, behavior?: (() => void) | null, debug?: boolean): void;
		/** The root DOM element of the processed document (set after processing). */
		dom?: Element;
		[key: string]: unknown;
	}

	/** Per-element callback invoked during DOM conversion. */
	type PerElementFn = (newElement: Element, originalElement: Element) => void;

	/** Callback invoked with the processed DOM result. */
	type ResultCallback = (dom: DocumentFragment, ceteicean: CETEI) => void;

	export default class CETEI {
		constructor(options?: CETEIOptions);

		// --- Properties ---

		/** The options passed to the constructor (or `{}`). */
		options: CETEIOptions;
		/** The Document object used for DOM operations. */
		document: Document;
		/**
		 * Element names (qualified as `prefix:localName`) discovered during processing.
		 * Initialized as `[]`, then set to a `Set<string>` after `domToHTML5`/`makeHTML5`/`processPage`.
		 */
		els: string[] | Set<string>;
		/** Map of namespace URIs to prefixes. */
		namespaces: Map<string, string>;
		/** Registered behaviors keyed by qualified name (`prefix:element`). */
		behaviors: Record<string, BehaviorValue>;
		/** Whether a `<rendition scheme="css">` was found and converted to a `<style>`. */
		hasStyle: boolean;
		/** TEI prefix definitions from `<prefixDef>` elements. */
		prefixDefs: string[] & Record<string, { matchPattern: string; replacementPattern: string }>;
		/** Whether processing is complete. */
		done: boolean;
		/** Base URL for rewriting relative links. */
		base: string;
		/** If `true`, enables debug logging. */
		debug: boolean;
		/** If `true`, discards original content when applying behaviors. */
		discardContent: boolean;
		/** The processed DOM fragment. */
		dom: DocumentFragment;
		/** The parsed XML DOM (set after `makeHTML5` or `domToHTML5`). */
		XML_dom: Document;
		/** Bound utility functions. */
		utilities: CETEIUtilities;

		// --- Public Methods ---

		/**
		 * Add a set of behaviors to CETEIcean's processing workflow.
		 * Added behaviors override predefined behaviors with the same name.
		 */
		addBehaviors(behaviors: BehaviorsObject): void;

		/**
		 * Add or replace an individual behavior.
		 * @param ns - A namespace prefix string (e.g. `"tei"`) or an object mapping
		 *   a new prefix to its namespace URI (e.g. `{ doc: "http://docbook.org/ns/docbook" }`).
		 * @param element - The local element name.
		 * @param behavior - The behavior definition.
		 */
		addBehavior(ns: string | Record<string, string>, element: string, behavior: BehaviorValue): void;

		/**
		 * Remove a previously defined or default behavior.
		 * @param ns - A namespace prefix string or an object mapping prefix to URI.
		 * @param element - The local element name.
		 */
		removeBehavior(ns: string | Record<string, string>, element: string): void;

		/**
		 * Fetch an XML source document from a URL and convert to HTML5 Custom Elements.
		 * @returns The processed DOM fragment when no callback is provided.
		 */
		getHTML5(url: string): Promise<DocumentFragment>;
		getHTML5(url: string, callback: ResultCallback, perElementFn?: PerElementFn): Promise<void>;
		getHTML5(
			url: string,
			callback?: ResultCallback | null,
			perElementFn?: PerElementFn
		): Promise<DocumentFragment | void>;

		/**
		 * Convert an XML string into HTML5 Custom Elements.
		 * @returns The processed DOM fragment when no callback is provided.
		 */
		makeHTML5(xml: string): DocumentFragment;
		makeHTML5(xml: string, callback: ResultCallback, perElementFn?: PerElementFn): void;
		makeHTML5(
			xml: string,
			callback?: ResultCallback | null,
			perElementFn?: PerElementFn
		): DocumentFragment | void;

		/**
		 * Convert an XML DOM into HTML5 Custom Elements.
		 * @returns The processed DOM fragment when no callback is provided.
		 */
		domToHTML5(xmlDom: Document): DocumentFragment;
		domToHTML5(xmlDom: Document, callback: ResultCallback, perElementFn?: PerElementFn): void;
		domToHTML5(
			xmlDom: Document,
			callback?: ResultCallback | null,
			perElementFn?: PerElementFn
		): DocumentFragment | void;

		/**
		 * Process an HTML page that already contains CETEIcean Custom Elements.
		 * Learns element names from the current document and applies behaviors.
		 */
		processPage(): void;

		/**
		 * Unset a namespace-to-prefix mapping (must be called before re-mapping).
		 * @param ns - The namespace URI to unset.
		 */
		unsetNamespace(ns: string): void;

		/**
		 * Set the base URL for rewriting relative links in the XML source.
		 */
		setBaseUrl(base: string): void;

		// --- Static Methods ---

		/** Save current scroll position to sessionStorage. */
		static savePosition(): void;
		/** Restore scroll position from sessionStorage. */
		static restorePosition(): void;
	}

	export type { BehaviorValue, BehaviorSet, BehaviorsObject, CETEIOptions, CETEIUtilities, PerElementFn, ResultCallback };
}
