import { type AcceptanceMethod, type AcceptanceRecord } from 'terms-acceptance';
import { ITermsAcceptanceClaim, ITermsAcceptanceDocument } from '@gauzy/contracts';
import { TypeOrmTermsAcceptanceRepository } from './repository/type-orm-terms-acceptance.repository';
/** The product id this deployment publishes under in the legal corpus. */
export declare const TERMS_PRODUCT = "gauzy";
/**
 * Records terms-of-service acceptance.
 *
 * ## What this exists to fix
 *
 * The register form has always rendered a hard-required "I agree to the Terms"
 * checkbox and used it to enable the submit button — and then
 * `AuthStrategy.register()` destructured the payload and dropped it, the DTO had
 * no field for it, and no table had a column for it. The user saw a checkbox;
 * the database had nothing. Asked *which version of the Terms did this customer
 * accept, and what did the text say at the time?* there was no answer and no way
 * to construct one. The invite-acceptance form had the identical defect.
 *
 * ## How a record becomes evidence
 *
 * A row carries the `sha256` of the document *source* as published by
 * `@ever-co/legal`. Years later that digest can be recomputed from the corpus at
 * the matching tag and compared byte for byte, which is the difference between
 * "we believe they accepted v1" and being able to show the text they accepted.
 *
 * Because the digest arrives from a browser, it is a *claim* until the server
 * has checked it. Passing `corpus` to the recorder makes every write go through
 * `assertPublishedText`, so an acceptance can never point at text the corpus
 * never published — a bug (or a forged request) fails loudly instead of writing
 * evidence that means nothing.
 */
export declare class TermsAcceptanceService {
    private readonly typeOrmTermsAcceptanceRepository;
    private readonly logger;
    private readonly recorder;
    constructor(typeOrmTermsAcceptanceRepository: TypeOrmTermsAcceptanceRepository);
    /**
     * The documents a user must accept, straight from the corpus.
     *
     * The server publishes these so the client never has to guess a version or a
     * digest — and so the value that gates the submit button is the same value
     * that comes back on submit.
     */
    getRequiredDocuments(locale?: string): ITermsAcceptanceDocument[];
    /**
     * Record the acceptance a signup or invite-acceptance form collected.
     *
     * Idempotent per `(subject, tenant, document, version)`: a double-submitted
     * form returns the record that already exists rather than writing a second
     * one, so two pieces of evidence can never disagree about the time.
     *
     * @param subjectId The user the acceptance belongs to.
     * @param claims What the form says it displayed. Validated against the corpus.
     * @param context Tenant scope, client IP, user-agent and how consent was obtained.
     */
    record(subjectId: string, claims: ITermsAcceptanceClaim[], context: {
        tenantId?: string | null;
        method: AcceptanceMethod;
        ip?: string | null;
        userAgent?: string | null;
        metadata?: Record<string, unknown> | null;
    }): Promise<AcceptanceRecord[]>;
    /**
     * Validate claims *before* anything irreversible happens.
     *
     * Called ahead of user creation so a missing, malformed or unpublished claim
     * rejects the registration outright instead of leaving a half-created account
     * behind. `assertPublishedText` is pure and synchronous — no storage, no
     * clock, no network — so this is cheap enough to run on the hot path.
     *
     * @throws BadRequestException when a claim does not match published text.
     */
    assertClaimsArePublished(claims: ITermsAcceptanceClaim[]): void;
    /** Every acceptance on file for a user, newest first, integrity-checked. */
    history(subjectId: string, tenantId?: string | null): Promise<AcceptanceRecord[]>;
}
