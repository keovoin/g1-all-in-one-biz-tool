import { Document } from '../../entities/document.entity';
/**
 * Server-side markdown rendering of a document's knowledge content.
 *
 * - FILE → the stored `extractedText` (already normalized markdown).
 * - PAGE → the sanitized `contentHtml` render cache converted through the shared
 *   GFM Turndown converter; a `contentJson`-only page falls back to a deterministic
 *   plain-text walk of the TipTap JSON tree.
 * - FOLDER → `null` (never indexable).
 */
export declare function renderKnowledgeMarkdown(document: Document): string | null;
