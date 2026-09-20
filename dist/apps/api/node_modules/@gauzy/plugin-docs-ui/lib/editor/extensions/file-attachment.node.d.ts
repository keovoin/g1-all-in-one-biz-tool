import { Node } from '@tiptap/core';
export interface IFileAttachmentAttributes {
    /** Child FILE document id — the ONLY stable reference; URLs are derived, never stored. */
    documentId: string | null;
    name: string;
    size: number;
    mimeType: string;
    /** Transient upload correlation id — stripped from every persisted payload (spec 05 §6.6). */
    uploadId: string | null;
}
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fileAttachment: {
            /** Inserts a file-attachment card at the current position. */
            insertFileAttachment: (attributes: Partial<IFileAttachmentAttributes>) => ReturnType;
        };
    }
}
/**
 * `fileAttachment` custom node (spec 05 §6.2): atomic, draggable card holding
 * exactly `{ documentId, name, size, mimeType }`. The static render is an
 * anchor to the authenticated raw stream; the Angular node view adds download /
 * open / error affordances.
 */
export declare const FileAttachment: Node<any, any>;
