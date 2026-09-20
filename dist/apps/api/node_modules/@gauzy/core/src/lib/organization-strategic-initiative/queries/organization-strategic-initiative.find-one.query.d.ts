import { IQuery } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '../../core/crud';
import { OrganizationStrategicInitiative } from '../organization-strategic-initiative.entity';
/**
 * Query to find a single organization strategic initiative by ID.
 */
export declare class OrganizationStrategicInitiativeFindOneQuery implements IQuery {
    readonly id: ID;
    readonly options?: BaseQueryDTO<OrganizationStrategicInitiative>;
    static readonly type = "[OrganizationStrategicInitiative] Find One";
    constructor(id: ID, options?: BaseQueryDTO<OrganizationStrategicInitiative>);
}
