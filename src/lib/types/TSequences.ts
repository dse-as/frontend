import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';
import type { TDocKeys } from './documents/TDocuments';
import type { TPeopleKeys } from './register/TPeopleKeys';

// Full Sequence and Attributes
export type TSeq = typeof seqAll;
export type TSeqAttrs = {
	url_slug: string;
	name: string;
	preamble: string;
	personId?: TPeopleKeys;
	docs: TDocKeys[];
};

// Types
export type TSeqTypes = keyof TSeq;

// Keys
export type TSeqTextstufenKeys = keyof TSeq['textstufen'];
export type TSeqTravelsKeys = keyof TSeq['travels'];
export type TSeqCorrespondenceKeys = keyof TSeq['correspondence'];
export type TSeqSeriesKeys = keyof TSeq['series'];

export type TSeqKeys =
	| TSeqTextstufenKeys
	| TSeqTravelsKeys
	| TSeqCorrespondenceKeys
	| TSeqSeriesKeys;
