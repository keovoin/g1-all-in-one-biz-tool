import { HttpClient } from '@angular/common/http';
import { ICreateEmailInvitesInput, ICreateEmailInvitesOutput, IInvite, IInviteFindInput, IPublicInviteFindInput, IInviteAcceptInput, IInviteResendInput, IOrganizationContact, IOrganizationContactAcceptInviteInput, IAuthResponse } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class InviteService {
    private readonly http;
    constructor(http: HttpClient);
    createWithEmails(createInput: ICreateEmailInvitesInput): Promise<ICreateEmailInvitesOutput>;
    getAll(relations: string[], findInput?: IInviteFindInput): Promise<{
        items: IInvite[];
        total: number;
    }>;
    validateInvite(relations: string[], where: IPublicInviteFindInput): Promise<IInvite>;
    update(id: string, updateInput: any): Promise<any>;
    acceptInvite(input: Partial<IInviteAcceptInput>): Promise<IAuthResponse>;
    resendInvite(inviteResendInput: IInviteResendInput): Promise<any>;
    delete(id: string): Promise<any>;
    inviteOrganizationContact(organizationContactId: string): Promise<IOrganizationContact>;
    acceptOrganizationContactInvite(acceptInviteInput: IOrganizationContactAcceptInviteInput): Promise<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InviteService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<InviteService>;
}
