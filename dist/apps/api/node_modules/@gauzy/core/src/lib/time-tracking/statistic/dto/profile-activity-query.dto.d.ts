import { ID, IGetProfileActivity } from '@gauzy/contracts';
export declare class ProfileActivityQueryDTO implements IGetProfileActivity {
    readonly organizationId: ID;
    readonly employeeId: ID;
    readonly organizationTeamId?: ID;
    readonly startDate: string;
    readonly endDate: string;
    readonly timeZone: string;
    readonly includeDaily: boolean;
}
