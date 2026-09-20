import { ITermsAcceptanceClaim } from '@gauzy/contracts';
/**
 * One document a signup / invite-acceptance form says it displayed.
 *
 * These values arrive from a browser, so they are a *claim*, not evidence. The
 * shape checks here only stop obvious rubbish; what makes the claim true is
 * `TermsAcceptanceService`, which re-checks every field against the published
 * legal corpus before a row is written. A digest the corpus never published is
 * rejected outright — recording it would produce evidence pointing at nothing.
 */
export declare class TermsAcceptanceClaimDTO implements ITermsAcceptanceClaim {
    readonly documentId: string;
    readonly version: string;
    readonly sha256: string;
    readonly locale: string;
}
