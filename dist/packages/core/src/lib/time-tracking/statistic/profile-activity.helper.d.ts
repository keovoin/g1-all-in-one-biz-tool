import { IGetProfileActivity, IProfileActivity } from '@gauzy/contracts';
export interface ProfileActivityPeriod {
    startDate: Date;
    endDate: Date;
    timeZone: string;
}
export interface ProfileActivityDayBucket {
    date: string;
    endDate: Date;
}
export type ProfileActivityRawRow = {
    date: string;
    duration: unknown;
} | {
    startedAt: Date | string;
    stoppedAt: Date | string;
};
export declare function resolveProfileActivityPeriod(request: IGetProfileActivity): ProfileActivityPeriod;
/**
 * Builds ordered, half-open local-day boundaries for a bounded profile activity request.
 * A boundary-only representation keeps the generated aggregate below SQLite's parameter
 * limit while assigning every selected UTC instant to the same IANA local date as Node.
 */
export declare function buildProfileActivityDayBuckets(request: IGetProfileActivity): ProfileActivityDayBucket[];
export declare function buildProfileActivityResponse(request: IGetProfileActivity, period: ProfileActivityPeriod, rows: ProfileActivityRawRow[]): IProfileActivity;
