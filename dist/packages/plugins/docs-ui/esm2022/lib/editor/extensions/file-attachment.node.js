import { Node, mergeAttributes } from '@tiptap/core';
/**
 * `fileAttachment` custom node (spec 05 §6.2): atomic, draggable card holding
 * exactly `{ documentId, name, size, mimeType }`. The static render is an
 * anchor to the authenticated raw stream; the Angular node view adds download /
 * open / error affordances.
 */
export const FileAttachment = Node.create({
    name: 'fileAttachment',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            documentId: {
                default: null,
                // `?? null`: `dataset` answers `undefined` where `getAttribute` answered
                // `null`, and this attribute's default is `null`.
                parseHTML: (element) => element.dataset.documentId ?? null,
                renderHTML: (attributes) => attributes['documentId'] ? { 'data-document-id': attributes['documentId'] } : {}
            },
            name: {
                default: '',
                parseHTML: (element) => element.dataset.name ?? element.textContent ?? '',
                renderHTML: (attributes) => ({ 'data-name': attributes['name'] })
            },
            size: {
                default: 0,
                parseHTML: (element) => Number(element.dataset.size ?? 0),
                renderHTML: (attributes) => ({ 'data-size': String(attributes['size'] ?? 0) })
            },
            mimeType: {
                default: '',
                parseHTML: (element) => element.dataset.mimeType ?? '',
                renderHTML: (attributes) => ({ 'data-mime-type': attributes['mimeType'] })
            },
            // Transient — never persisted (stripped by sanitizeContentJson, spec 05 §6.6).
            uploadId: {
                default: null,
                parseHTML: () => null,
                renderHTML: () => ({})
            }
        };
    },
    parseHTML() {
        return [{ tag: 'a[data-type="file-attachment"]' }];
    },
    renderHTML({ node, HTMLAttributes }) {
        const documentId = node.attrs['documentId'];
        return [
            'a',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'file-attachment',
                class: 'gz-file-attachment',
                href: documentId ? `/api/plugins/docs/documents/${documentId}/raw` : null,
                rel: 'noopener noreferrer'
            }),
            node.attrs['name'] || ''
        ];
    },
    addCommands() {
        return {
            insertFileAttachment: (attributes) => ({ commands }) => commands.insertContent({ type: this.name, attrs: attributes })
        };
    }
});
//# sourceMappingURL=file-attachment.node.js.map