import { behaviors, wrapAnnotations } from '$lib/CETEIcean/behaviors';
import CETEI from 'CETEIcean';
import { JSDOM } from 'jsdom';

export interface ProcessedTEI {
	//   dom: Document;
	//   ceteicean: typeof CETEI;
	serialized: string;
	elements: string[];
}

const processTEI = (xml: string): ProcessedTEI => {
	const xmlDom = new JSDOM(xml, { contentType: 'text/xml' });
	const xmlDoc = xmlDom.window.document;

	const htmlDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
	const htmlDoc = htmlDom.window.document;

	const ceteicean = new CETEI({
		documentObject: htmlDoc
	});

	//apply behaviors here, if needed, before serializing
	ceteicean.addBehaviors(behaviors(htmlDoc));
	const domFragment = ceteicean.domToHTML5(xmlDoc);
	const container = htmlDoc.createElement('div');
	container.appendChild(domFragment);
	wrapAnnotations(container);
	const serialized = container.innerHTML;

	return {
		serialized,
		elements: Array.from(ceteicean.els) as string[]
	};
};

export { processTEI as default, processTEI };
