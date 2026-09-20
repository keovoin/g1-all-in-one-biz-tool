import { IDateRangePicker, IOrganizationTeamStatisticInput } from '@gauzy/contracts';
import { IQuery } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { OrganizationTeam } from '../../../core/entities/internal';
export declare class FindPublicTeamQuery implements IQuery {
    readonly params: FindOptionsWhere<OrganizationTeam>;
    readonly options: IDateRangePicker & IOrganizationTeamStatisticInput;
    constructor(params: FindOptionsWhere<OrganizationTeam>, options: IDateRangePicker & IOrganizationTeamStatisticInput);
}
