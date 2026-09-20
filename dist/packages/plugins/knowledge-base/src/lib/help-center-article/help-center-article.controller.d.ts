import { IHelpCenterArticle, ID, IPagination, IHelpCenterArticleFiltering } from '@gauzy/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { Response, Request } from 'express';
import { CrudController, BaseQueryDTO } from '@gauzy/core';
import { HelpCenterArticle } from './help-center-article.entity';
import { HelpCenterArticleService } from './help-center-article.service';
import { UpdateHelpCenterArticleDTO } from './dto';
export declare class HelpCenterArticleController extends CrudController<HelpCenterArticle> {
    private readonly helpCenterArticleService;
    private readonly commandBus;
    constructor(helpCenterArticleService: HelpCenterArticleService, commandBus: CommandBus);
    create(entity: IHelpCenterArticle): Promise<IHelpCenterArticle>;
    /**
     * Create a copy of an article (without binary content).
     */
    duplicate(id: string): Promise<HelpCenterArticle>;
    findByCategoryId(categoryId: ID): Promise<IHelpCenterArticle[]>;
    findByProjectId(projectId: ID, options: BaseQueryDTO<HelpCenterArticle> & IHelpCenterArticleFiltering): Promise<IPagination<IHelpCenterArticle>>;
    /**
     * Returns the Y.js binary state as application/octet-stream.
     * Returns an empty buffer if no binary is stored yet.
     */
    getDescription(id: string, res: Response): Promise<void>;
    /**
     * Upload raw binary description (application/octet-stream).
     * Bypasses JSON serialization so Uint8Array is stored correctly in the DB.
     */
    uploadBinaryDescription(id: string, req: Request): Promise<void>;
    /**
     * Atomic update of all description fields (binary, HTML, JSON).
     *
     * Binary content is received as a base64-encoded string and decoded server-side.
     * Uses a direct QueryBuilder update to bypass TypeORM's QueryDeepPartialEntity
     * typing, which silently drops Buffer values for Uint8Array-typed entity fields.
     */
    patchDescription(id: string, body: {
        descriptionBinary?: string;
        descriptionHtml?: string;
        descriptionJson?: any;
    }): Promise<void>;
    deleteBulkByCategoryId(categoryId: string): Promise<any>;
    /**
     * UPDATE Help Center Article By Id
     *
     * @param id
     * @param updateInput
     * @returns
     */
    update(id: IHelpCenterArticle['id'], updateInput: UpdateHelpCenterArticleDTO): Promise<void>;
    /**
     * DELETE Help Center Article By Id
     *
     * Overrides the inherited `CrudController.delete()` route only to attach the permission gate:
     * `PermissionGuard` authorizes any route that carries no `@Permissions` metadata, so an
     * inherited handler is reachable by every member of the tenant until it is gated here. This is
     * the route the Angular Help Center uses to delete an article.
     */
    delete(id: ID): Promise<any>;
    /**
     * SOFT DELETE Help Center Article By Id
     *
     * Overrides the inherited `CrudController.softRemove()` route only to attach the permission gate.
     */
    softRemove(id: ID, ...options: any[]): Promise<HelpCenterArticle>;
    /**
     * RESTORE a soft-deleted Help Center Article By Id
     *
     * Overrides the inherited `CrudController.softRecover()` route only to attach the permission gate.
     */
    softRecover(id: ID, ...options: any[]): Promise<HelpCenterArticle>;
}
