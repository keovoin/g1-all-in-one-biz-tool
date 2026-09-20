import * as sanitizeHtml from 'sanitize-html';
/**
 * Shared server-side sanitization policy for the legacy rich-text HTML fields
 * (`Task.description`, `OrganizationProject.description`, `OrganizationProjectModule.description`,
 * `Employee.description`, `Organization.overview`, `HelpCenterArticle.data`,
 * `Proposal.jobPostContent` / `Proposal.proposalContent`, `EmployeeProposalTemplate.content`).
 *
 * These fields accept editor-produced HTML strings from the client and are re-rendered with
 * `[innerHTML]` — including on public, unauthenticated pages — so every write path MUST pass
 * through this allowlist before persisting.
 *
 * The allowlist mirrors 1:1 what the shared `ga-rich-text-editor` (TipTap v3 `standard` preset)
 * can produce — structural blocks, formatting marks, lists, links, images, and tables — so
 * legitimate editor output round-trips unchanged while `script`/`style` elements, `iframe`,
 * `object`/`embed`, form widgets, event-handler attributes (`on*`), `javascript:`/`data:` URLs,
 * and `svg`/`math` are all stripped.
 *
 * Exported as a standalone config object so core entities and plugins (job-proposal,
 * knowledge-base, docs) share one policy.
 */
export declare const RICH_HTML_SANITIZE_OPTIONS: sanitizeHtml.IOptions;
/**
 * Sanitizes a legacy rich-text HTML string against the shared allowlist policy.
 *
 * Idempotent (`sanitizeRichHtml(sanitizeRichHtml(x)) === sanitizeRichHtml(x)`) and safe on
 * empty input: `null`/`undefined`/`''` are returned unchanged so partial-update payloads that
 * omit (or explicitly clear) a field keep their exact semantics.
 *
 * @param html The raw HTML string received from the client (or stored pre-sanitization).
 * @returns The sanitized HTML string.
 */
export declare function sanitizeRichHtml(html: string): string;
