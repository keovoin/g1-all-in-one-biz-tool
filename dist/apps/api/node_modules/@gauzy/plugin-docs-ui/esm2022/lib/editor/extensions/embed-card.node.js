import { Node, mergeAttributes } from '@tiptap/core';
/**
 * `embedCard` custom node (spec 05 §6.2): atomic, draggable bookmark card.
 * v1 renders a generic globe + domain (no external favicon fetch); the attrs
 * are forward-compatible with server-side metadata enrichment (spec 05 §16).
 */
export const EmbedCard = Node.create({
    name: 'embedCard',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            url: {
                default: '',
                parseHTML: (element) => element.getAttribute('href') ?? element.dataset.url ?? '',
                renderHTML: () => ({})
            },
            // `?? null` on every optional attribute below: `dataset` answers `undefined`
            // where `getAttribute` answered `null`, and these defaults are `null`.
            title: {
                default: null,
                parseHTML: (element) => element.dataset.title ?? null,
                renderHTML: (attributes) => (attributes['title'] ? { 'data-title': attributes['title'] } : {})
            },
            description: {
                default: null,
                parseHTML: (element) => element.dataset.description ?? null,
                renderHTML: (attributes) => attributes['description'] ? { 'data-description': attributes['description'] } : {}
            },
            imageUrl: {
                default: null,
                parseHTML: (element) => element.dataset.imageUrl ?? null,
                renderHTML: (attributes) => attributes['imageUrl'] ? { 'data-image-url': attributes['imageUrl'] } : {}
            }
        };
    },
    parseHTML() {
        return [{ tag: 'a[data-type="embed-card"]' }];
    },
    renderHTML({ node, HTMLAttributes }) {
        const url = node.attrs['url'] || '';
        return [
            'a',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'embed-card',
                class: 'gz-embed-card',
                href: url,
                target: '_blank',
                rel: 'noopener noreferrer nofollow'
            }),
            node.attrs['title'] || url
        ];
    },
    addCommands() {
        return {
            insertEmbedCard: (attributes) => ({ commands }) => commands.insertContent({
                type: this.name,
                attrs: { title: null, description: null, imageUrl: null, ...attributes }
            })
        };
    }
});
//# sourceMappingURL=embed-card.node.js.map