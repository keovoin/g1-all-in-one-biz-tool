import { Injector } from '@angular/core';
import { SuggestionHostService } from './suggestion-host.service';
/**
 * Document cross-links (`+`) — spec 05 §7.2. Name search over PAGE + FILE
 * documents (RBAC-filtered server-side). Renders as a link chip to
 * `/pages/documents?id={id}`; on save the backend walks the JSON and upserts
 * `DocumentLink` rows.
 */
export declare function createDocumentMention(injector: Injector, host: SuggestionHostService): import("@tiptap/core").Node<import("@tiptap/extension-mention").MentionOptions<any, import("@tiptap/extension-mention").MentionNodeAttrs>, any>;
