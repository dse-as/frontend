// import type { TDocDict, TDocGroupsFlat, TDocTypes } from '$lib/types/documents/TDocuments';
// import type { TLettersGroups } from '$lib/types/documents/TLettersGroups';
// import type { TRegDict, TRegGroupsFlat, TRegTypes } from '$lib/types/register/TRegister';

// export function resolveGroup<T extends "documents"|"register">(
// 	dict: T extends "documents" ? TDocDict : TRegDict,
// 	groupKey:  T extends "documents" ? TDocGroupsFlat : TRegGroupsFlat,
// 	type:  T extends "documents" ? TDocTypes : TRegTypes
// ) {
// 	switch (type) {
// 		case 'letters':
// 			return (dict as TDocDict).dict_docs.letters.groups[groupKey as TLettersGroups];
// 		case 'smallforms':
// 			return dict.groups.groupKey;
// 		default:
// 			return null;
// 	}
// }
