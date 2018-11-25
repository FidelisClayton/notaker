/*
 * Term: *Emphasis*
 * Match: ^^^^^^^^
*/
export const matchEmphasis = /(\*|_)(.*?)(\*|_)/gm

/*
 * Term: **Bold**
 * Match:  ^^^^
*/
export const matchBold = /(\*\*|__)(.*?)(\*\*|__)/gm

/*
 * Term: ***Emphasis + Bold***
 * Match:   ^^^^^^^^^^^^^^^
*/
export const matchEmphasisAndBold = /(\*\*\*|___)(.*?)(\*\*\*|___)/gm

/*
 * Term:  ## Title
 * Match: ^^
*/
export const matchTitleMarkup = /(#|##|###|####|#####|######)/gm

/*
 * Term:  ## Title
 * Match: ^^^^^^^^
*/
export const matchTitle = /^((# |## |### |#### |##### |###### ))(.+?)$/gm

export const matchEmptyCheckbox = /\[ \]/g

export const matchCheckedCheckbox = /\[(x|X)\]/g
