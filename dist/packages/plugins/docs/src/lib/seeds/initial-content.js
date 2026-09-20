"use strict";
/**
 * Starter content seeded once per organization (only when the org has zero `document` rows):
 * one root "Company Library" folder containing one "Welcome to Documents" page.
 * Plain seeded content — deliberately not i18n-keyed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STARTER_PAGE_CONTENT_HTML = exports.STARTER_PAGE_CONTENT_JSON = exports.STARTER_PAGE_ICON = exports.STARTER_PAGE_NAME = exports.STARTER_FOLDER = void 0;
exports.STARTER_FOLDER = {
    name: 'Company Library',
    icon: '📚'
};
exports.STARTER_PAGE_NAME = 'Welcome to Documents';
exports.STARTER_PAGE_ICON = '👋';
/**
 * The welcome page's canonical TipTap JSON document.
 */
exports.STARTER_PAGE_CONTENT_JSON = {
    type: 'doc',
    content: [
        {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Welcome to Documents' }]
        },
        {
            type: 'paragraph',
            content: [
                {
                    type: 'text',
                    text: 'This is your company library — one place for uploaded files, authored pages, and the knowledge your AI assistant can draw on.'
                }
            ]
        },
        {
            type: 'bulletList',
            content: [
                {
                    type: 'listItem',
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                { type: 'text', text: 'Upload files — PDFs, spreadsheets, images and more are stored, extracted, and searchable.' }
                            ]
                        }
                    ]
                },
                {
                    type: 'listItem',
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                { type: 'text', text: 'Write pages — draft wiki pages right here, organized in folders with versions and comments.' }
                            ]
                        }
                    ]
                },
                {
                    type: 'listItem',
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                { type: 'text', text: 'Curate AI knowledge — choose exactly which documents your AI assistant can use to answer questions.' }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
/**
 * The same content rendered as the HTML cache (kept in sync with the JSON above at seed time).
 */
exports.STARTER_PAGE_CONTENT_HTML = [
    '<h1>Welcome to Documents</h1>',
    '<p>This is your company library — one place for uploaded files, authored pages, and the knowledge your AI assistant can draw on.</p>',
    '<ul>',
    '<li><p>Upload files — PDFs, spreadsheets, images and more are stored, extracted, and searchable.</p></li>',
    '<li><p>Write pages — draft wiki pages right here, organized in folders with versions and comments.</p></li>',
    '<li><p>Curate AI knowledge — choose exactly which documents your AI assistant can use to answer questions.</p></li>',
    '</ul>'
].join('');
//# sourceMappingURL=initial-content.js.map