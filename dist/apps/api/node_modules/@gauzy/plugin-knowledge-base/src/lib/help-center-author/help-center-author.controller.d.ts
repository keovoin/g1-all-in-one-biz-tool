import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { HelpCenterAuthor } from './help-center-author.entity';
import { HelpCenterAuthorService } from './help-center-author.service';
import { CommandBus } from '@nestjs/cqrs';
import { CrudController } from '@gauzy/core';
import { ID, IHelpCenterAuthor, IPagination } from '@gauzy/contracts';
export declare class HelpCenterAuthorController extends CrudController<HelpCenterAuthor> {
    private readonly commandBus;
    private readonly helpCenterAuthorService;
    constructor(commandBus: CommandBus, helpCenterAuthorService: HelpCenterAuthorService);
    findByArticleId(articleId: string): Promise<IHelpCenterAuthor[]>;
    deleteBulkByArticleId(articleId: string): Promise<any>;
    findAll(data: any): Promise<IPagination<IHelpCenterAuthor>>;
    createBulk(input: any): Promise<IHelpCenterAuthor[]>;
    /**
     * CREATE an article author row
     *
     * Overrides the inherited `CrudController.create()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here.
     */
    create(entity: DeepPartial<HelpCenterAuthor>): Promise<HelpCenterAuthor>;
    /**
     * UPDATE an article author row by id
     *
     * Overrides the inherited `CrudController.update()` route only to attach the permission gate.
     */
    update(id: ID, entity: QueryDeepPartialEntity<HelpCenterAuthor>): Promise<any>;
    /**
     * DELETE an article author row by id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate.
     */
    delete(id: ID): Promise<any>;
    /**
     * SOFT DELETE an article author row by id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    softRemove(id: ID, ...options: any[]): Promise<HelpCenterAuthor>;
    /**
     * RESTORE a soft-deleted article author row by id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    softRecover(id: ID, ...options: any[]): Promise<HelpCenterAuthor>;
}
