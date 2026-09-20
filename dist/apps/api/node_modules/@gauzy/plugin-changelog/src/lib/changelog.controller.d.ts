import { CommandBus } from '@nestjs/cqrs';
import { IChangelog, IChangelogCreateInput, IChangelogUpdateInput, ID, IPagination } from '@gauzy/contracts';
import { CrudController } from '@gauzy/core';
import { DeleteResult } from 'typeorm';
import { Changelog } from './changelog.entity';
import { ChangelogService } from './changelog.service';
import { ChangelogQueryDTO } from './dto/changelog-query.dto';
/**
 * Changelog is PLATFORM-level content: the public GET feeds the "What's New"
 * sidebar plus the login/register pages, and every write is a broadcast to all
 * of them. Writes are therefore SUPER_ADMIN-only — before this guard any
 * authenticated user could rewrite what every visitor sees on the login page.
 */
export declare class ChangelogController extends CrudController<Changelog> {
    private readonly changelogService;
    private readonly commandBus;
    constructor(changelogService: ChangelogService, commandBus: CommandBus);
    /**
     * Public list of changelog entries, newest first (see the service for the
     * ordering/cap). `whitelist` matters here: the DTO'd query goes straight
     * into a TypeORM `where`, so unknown params must be stripped, not passed.
     *
     * @param options
     * @returns
     */
    findChangelog(options: ChangelogQueryDTO): Promise<IPagination<IChangelog>>;
    /**
     *
     * @param entity
     * @returns
     */
    create(entity: IChangelogCreateInput): Promise<IChangelog>;
    /**
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: IChangelogUpdateInput): Promise<IChangelog>;
    /**
     * Overrides the inherited CRUD delete purely to attach the SUPER_ADMIN
     * guard — the base route ships with class-level AuthGuard only.
     *
     * @param id
     * @returns
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * Same guard-only override for the inherited soft-delete route.
     */
    softRemove(id: ID): Promise<Changelog>;
    /**
     * Same guard-only override for the inherited soft-recover route.
     */
    softRecover(id: ID): Promise<Changelog>;
}
