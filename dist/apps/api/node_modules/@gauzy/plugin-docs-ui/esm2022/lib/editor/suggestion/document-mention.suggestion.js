import { PluginKey } from '@tiptap/pm/state';
import { mergeAttributes } from '@tiptap/core';
import Mention from '@tiptap/extension-mention';
import { firstValueFrom } from 'rxjs';
import { DocumentKindEnum } from '@gauzy/contracts';
import { DocumentsService } from '../../services/documents.service';
const DEBOUNCE_MS = 250;
const LIMIT = 10;
/**
 * Document cross-links (`+`) — spec 05 §7.2. Name search over PAGE + FILE
 * documents (RBAC-filtered server-side). Renders as a link chip to
 * `/pages/documents?id={id}`; on save the backend walks the JSON and upserts
 * `DocumentLink` rows.
 */
export function createDocumentMention(injector, host) {
    const documentsService = injector.get(DocumentsService);
    let sequence = 0;
    let debounceTimer = null;
    return Mention.extend({ name: 'documentMention' }).configure({
        HTMLAttributes: { class: 'gz-document-mention', 'data-type': 'document-mention' },
        renderText: ({ node }) => `+${node.attrs['label'] ?? node.attrs['id']}`,
        renderHTML: ({ options, node }) => [
            'a',
            mergeAttributes(options.HTMLAttributes, {
                'data-id': node.attrs['id'],
                href: `/pages/documents?id=${node.attrs['id']}`
            }),
            `${node.attrs['label'] ?? node.attrs['id']}`
        ],
        suggestion: {
            char: '+',
            pluginKey: new PluginKey('gzDocumentMention'),
            items: ({ query }) => new Promise((resolve) => {
                if (debounceTimer)
                    clearTimeout(debounceTimer);
                const mySequence = ++sequence;
                debounceTimer = setTimeout(async () => {
                    try {
                        const { items } = await firstValueFrom(documentsService.getAll({
                            q: (query ?? '').trim(),
                            searchIn: 'name',
                            kind: [DocumentKindEnum.PAGE, DocumentKindEnum.FILE],
                            archived: false,
                            take: LIMIT
                        }));
                        if (mySequence !== sequence)
                            return resolve([]);
                        resolve((items ?? []).map((doc) => ({
                            id: String(doc.id),
                            label: doc.name,
                            icon: doc.kind === DocumentKindEnum.PAGE ? 'file-text-outline' : 'file-outline',
                            data: { id: String(doc.id), label: doc.name }
                        })));
                    }
                    catch {
                        resolve([]);
                    }
                }, DEBOUNCE_MS);
            }),
            command: ({ editor, range, props }) => {
                const item = props;
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .insertContent([
                    { type: 'documentMention', attrs: item.data },
                    { type: 'text', text: ' ' }
                ])
                    .run();
            },
            render: () => ({
                onStart: (props) => host.open(props, 'DOCS.EDITOR.LINK_DOC_ARIA_LABEL'),
                onUpdate: (props) => host.update(props, 'DOCS.EDITOR.LINK_DOC_ARIA_LABEL'),
                onKeyDown: ({ event }) => host.onKeyDown(event),
                onExit: () => host.close()
            })
        }
    });
}
//# sourceMappingURL=document-mention.suggestion.js.map