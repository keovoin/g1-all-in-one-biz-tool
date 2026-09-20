import { IQuery } from '@nestjs/cqrs';
import { IOrganizationStrategicInitiativeFindInput } from '@gauzy/contracts';
import { BaseQueryDTO } from '../../core/crud';
import { OrganizationStrategicInitiative } from '../organization-strategic-initiative.entity';
/**
 * Query to find all organization strategic initiatives with optional filters.
 */
export declare class OrganizationStrategicInitiativeFindAllQuery implements IQuery {
    readonly options?: BaseQueryDTO<OrganizationStrategicInitiative> & IOrganizationStrategicInitiativeFindInput;
    static readonly type = "[OrganizationStrategicInitiative] Find All";
    constructor(options?: BaseQueryDTO<OrganizationStrategicInitiative> & IOrganizationStrategicInitiativeFindInput);
}
