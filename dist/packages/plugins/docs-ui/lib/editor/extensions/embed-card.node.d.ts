import { Node } from '@tiptap/core';
export interface IEmbedCardAttributes {
    url: string;
    title: string | null;
    description: string | null;
    imageUrl: string | null;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        embedCard: {
            /** Inserts an embed/bookmark card for the given URL. */
            insertEmbedCard: (attributes: Partial<IEmbedCardAttributes> & {
                url: string;
            }) => ReturnType;
        };
    }
}
/**
 * `embedCard` custom node (spec 05 §6.2): atomic, draggable bookmark card.
 * v1 renders a generic globe + domain (no external favicon fetch); the attrs
 * are forward-compatible with server-side metadata enrichment (spec 05 §16).
 */
export declare const EmbedCard: Node<any, any>;
