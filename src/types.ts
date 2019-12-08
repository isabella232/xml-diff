import { ElementType } from '@emmetio/html-matcher';

export interface ParsedModel {
    tokens: Token[];
    content: string;
}

export const enum ElementTypeAddon {
    Space = 100,
    InsertBefore = 101,
    InsertAfter = 102,
    Delete = 103,
}

export type TokenType = ElementType | ElementTypeAddon;

export interface Token {
    name: string;
    type: TokenType;

    /** Token location in original text */
    location: number;

    /** Token’s raw value */
    value: string;

    /** Optional location offset */
    offset?: number;

    /** Custom field for token ordering/sorting */
    order?: number;
}
