import { IUserRegistrationInput } from '@gauzy/contracts';
import { TermsAcceptanceClaimDTO } from './../../terms-acceptance/dto';
import { CreateUserDTO } from './create-user.dto';
/**
 * Register User DTO validation
 */
export declare class RegisterUserDTO implements IUserRegistrationInput {
    readonly password: string;
    readonly confirmPassword: string;
    readonly user: CreateUserDTO;
    readonly organizationId?: string;
    readonly createdByUserId?: string;
    readonly featureAsEmployee?: boolean;
    /**
     * The legal documents the user ticked the box for, exactly as the form
     * displayed them.
     *
     * The register form has always rendered a hard-required terms checkbox — this
     * is the field that field was missing. Without it the checkbox gated the
     * submit button and the value went nowhere, which is the appearance of
     * consent with none of the evidence.
     *
     * Optional at the DTO layer because registration is not only an interactive
     * signup: imports, seeds and SUPER_ADMIN provisioning create users where no
     * checkbox was ever shown, and fabricating an acceptance for them would be
     * worse than recording none. `AuthService.register` decides what to do with
     * an absent value; when present, every claim is verified against the
     * published corpus before it is written.
     */
    readonly terms?: TermsAcceptanceClaimDTO[];
}
