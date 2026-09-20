import { ICustomSmtpFindInput, IOrganization } from "@gauzy/contracts";
/**
 * Custom Smtp Query Request DTO validation
 */
export declare class CustomSmtpQueryDTO implements ICustomSmtpFindInput {
    readonly organizationId: IOrganization['id'];
}
