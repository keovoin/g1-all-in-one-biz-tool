import { Response } from 'express';
import { ID, IImportHistory, IPagination } from '@gauzy/contracts';
import { ImportHistoryService } from './import-history.service';
export declare class ImportHistoryController {
    private readonly _importHistoryService;
    constructor(_importHistoryService: ImportHistoryService);
    /**
     *
     * @returns
     */
    findAll(): Promise<IPagination<IImportHistory>>;
    /**
     * Downloads the archive an import was made from.
     *
     * Replaces the public `fullUrl` link the Import page used to hand to the browser: the archive is a
     * full tenant data dump, so it is served only here — behind the same tenant and permission guards
     * as the history list (the class-level `@Permissions` applies to this handler too), and only for the
     * caller's own tenant's rows.
     *
     * @param id - The import-history row.
     * @param res - The Express response the archive is written to.
     */
    download(id: ID, res: Response): Promise<void>;
}
