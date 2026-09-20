import { ID, IHelpCenter, IPagination } from '@gauzy/contracts';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CommandBus } from '@nestjs/cqrs';
import { CrudController } from '@gauzy/core';
import { HelpCenterService } from './help-center.service';
import { HelpCenter } from './help-center.entity';
export declare class HelpCenterController extends CrudController<HelpCenter> {
    private readonly helpCenterService;
    private readonly commandBus;
    constructor(helpCenterService: HelpCenterService, commandBus: CommandBus);
    findAll(data: any): Promise<IPagination<IHelpCenter>>;
    create(entity: IHelpCenter): Promise<IHelpCenter>;
    updateBulk(input: any): Promise<IHelpCenter[]>;
    findByBaseId(baseId: string): Promise<IHelpCenter[]>;
    deleteBulkByBaseId(baseId: string): Promise<any>;
    /**
     * UPDATE a knowledge base / category by id
     *
     * Overrides the inherited `CrudController.update()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    update(id: ID, entity: QueryDeepPartialEntity<HelpCenter>): Promise<any>;
    /**
     * DELETE a knowledge base / category by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    delete(id: ID): Promise<any>;
    /**
     * SOFT DELETE a knowledge base / category by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    softRemove(id: ID, ...options: any[]): Promise<HelpCenter>;
    /**
     * RESTORE a soft-deleted knowledge base / category by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    softRecover(id: ID, ...options: any[]): Promise<HelpCenter>;
}
