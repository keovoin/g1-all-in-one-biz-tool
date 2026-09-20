import { DocumentShareAccessEnum } from '@gauzy/contracts';
/**
 * Access levels in escalating order — rendered as a select and used to label the
 * "what this grants" hint. `EDIT` still requires the subject to hold
 * `DOCS_UPDATE`; a share never substitutes for a permission (§3.3 composition
 * invariant), which is why the dialog spells that out.
 */
export const DOCS_SHARE_ACCESS_LEVELS = [
    DocumentShareAccessEnum.VIEW,
    DocumentShareAccessEnum.COMMENT,
    DocumentShareAccessEnum.EDIT
];
/** Backend `code` values the share endpoints can return (spec 03 §6). */
export const DOCS_SHARE_ERROR_CODES = {
    /** Both or neither of employee/team supplied. */
    TARGET: 'DOCS_SHARE_TARGET',
    /** The document is `ORGANIZATION`-visible — shares are meaningless there. */
    NOT_PRIVATE: 'DOCS_SHARE_NOT_PRIVATE'
};
//# sourceMappingURL=docs-share.model.js.map