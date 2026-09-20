import { IChangelog } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
export declare class Changelog extends TenantOrganizationBaseEntity implements IChangelog {
    icon?: string;
    title?: string;
    date?: Date;
    content?: string;
    isFeature?: boolean;
    learnMoreUrl?: string;
    imageUrl?: string;
}
