import { ITermsAcceptanceDocument } from '@gauzy/contracts';
import { TermsAcceptanceService } from './terms-acceptance.service';
export declare class TermsAcceptanceController {
    private readonly termsAcceptanceService;
    constructor(termsAcceptanceService: TermsAcceptanceService);
    /**
     * The documents a new account must accept, as currently published.
     *
     * Public and unauthenticated by necessity — it is read by the signup and
     * invite-acceptance forms, before any account exists.
     *
     * The point of serving this rather than hard-coding versions in the client is
     * that the value which gates the submit button and the value which is posted
     * back on submit are then the same object. Dropping it becomes a visible act
     * rather than an omission, which is exactly how the checkbox came to be
     * decorative in the first place.
     */
    getRequiredDocuments(locale?: string): Promise<ITermsAcceptanceDocument[]>;
}
