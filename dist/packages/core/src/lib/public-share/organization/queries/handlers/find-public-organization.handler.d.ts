import { IQueryHandler } from '@nestjs/cqrs';
import { IOrganization } from '@gauzy/contracts';
import { FindPublicOrganizationQuery } from './../find-public-organization.query';
import { PublicOrganizationService } from './../../public-organization.service';
export declare class FindPublicOrganizationHandler implements IQueryHandler<FindPublicOrganizationQuery> {
    private readonly publicOrganizationService;
    constructor(publicOrganizationService: PublicOrganizationService);
    execute(query: FindPublicOrganizationQuery): Promise<IOrganization>;
}
