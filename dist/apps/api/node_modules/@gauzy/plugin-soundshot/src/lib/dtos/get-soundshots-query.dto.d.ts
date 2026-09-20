import { ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '@gauzy/core';
import { FindOptionsWhere } from 'typeorm';
import { ISoundshot } from '../models/soundshot.model';
declare const GetSoundshotsQueryDTO_base: import("@nestjs/common").Type<Omit<BaseQueryDTO<ISoundshot>, "where">>;
export declare class GetSoundshotsQueryDTO extends GetSoundshotsQueryDTO_base {
    startDate?: Date | string;
    endDate?: Date | string;
    tenantId?: ID;
    organizationId?: ID;
    employeeIds?: ID[];
    timeZone?: string;
    readonly where?: FindOptionsWhere<ISoundshot>;
}
export {};
