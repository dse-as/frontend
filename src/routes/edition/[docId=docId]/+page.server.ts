import processTEI from './processTEI';
import type { ProcessedTEI } from './processTEI';
export const prerender = true;

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	async function loadText(params: { docId: string }): Promise<ProcessedTEI> {
		const defaultBody = {
			serialized: `
	<?xml version="1.0" encoding="UTF-8"?>
		<TEI xmlns="http://www.tei-c.org/ns/1.0">
			<text>
				<body>
					<div type="body" xml:lang="en">
						<p>No content available.</p>
					</div>
				</body>
			</text>
		</TEI>`,
			elements: []
		};

		try {
			// (1) Fetch xml data
			const res = await fetch(`/data/texts/text-${params.docId}.xml`);
			// Throw 404 if XML not found
			if (!res.ok) {
				if (res.status === 404) {
					console.warn('XML not found, using default data');
					return defaultBody;
				}
				throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
			}

			// (2) Extract xmlString
			const xmlString = await res.text();
			// Warn if empty/invalid XML
			if (!xmlString || !xmlString.trim()) {
				console.warn('Empty XML response, using default data');
				return defaultBody;
			}

			// (3) Apply CETEIcean's processTEI()
			try {
				const ceteiData = processTEI(xmlString);
				return ceteiData;
			} catch (parseErr) {
				console.error('TEI parse error:', parseErr);
				return defaultBody;
			}
		} catch (err) {
			// catch any other errors
			console.error('Failed to load XML:', err);
			return defaultBody;
		}
	}
	const ceteiData = await loadText(params);
	return { ceteiData };
};
