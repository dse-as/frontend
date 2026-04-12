export function lookupDocInfo(docId, metadata): TItem {
	return {
		docId: docId,
		fac: metadata[docId]?.manuscript?.iiif_urls[0],
		details: {
			type: 'smallform', //! changethis
			title: metadata[docId]?.metadata?.title_full,
			datestring: metadata[docId]?.metadata?.pubDate
		}
	};
}
