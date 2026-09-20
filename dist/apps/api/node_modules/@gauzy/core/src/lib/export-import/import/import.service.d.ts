import { CommandBus } from '@nestjs/cqrs';
import { IColumnRelationMetadata, IRepositoryModel, RepositoriesService } from '../repositories/repositories.service';
export declare class ImportService {
    private readonly commandBus;
    private repositoriesService;
    private readonly logger;
    /**
     * The export/import repository graph, built once.
     *
     * Derived from `RepositoriesService`'s module-init state, never from the request, so a single
     * shared copy is correct. The per-request state that used to live beside it — `_dirname` and
     * `_extractPath` — is not, and is threaded explicitly instead (see {@link createExtractDirectory}).
     */
    private repositories;
    constructor(commandBus: CommandBus, repositoriesService: RepositoriesService);
    /**
     * Builds (once) and returns the repository graph to import into.
     */
    private getRepositories;
    /**
     * Creates a private, per-request directory to extract an uploaded archive into.
     *
     * 🛑 Two defects are closed here. Every import used to extract into ONE fixed directory,
     * `<assetPublicPath>/import/csv`, derived from a field on this singleton service — so two
     * tenants importing at the same time read each other's CSVs, and tenant A's import inserted
     * tenant B's rows under tenant A's id (GHSA-g235-c4fm-4fc7). That directory is also served
     * unauthenticated by `ServeStaticModule` at `/public/`, so `GET /public/import/csv/user.csv`
     * returned the business data of whoever was importing — permanently, after any import that threw
     * before the cleanup step. `os.tmpdir()` is outside the served tree and unique per call.
     *
     * @returns Absolute path of the new, empty extraction directory.
     */
    createExtractDirectory(): Promise<string>;
    /**
     * Removes one request's extraction directory. Best effort; never throws.
     *
     * @param extractPath - The directory returned by {@link createExtractDirectory}.
     */
    removeExtractedFiles(extractPath: string): Promise<void>;
    /**
     * Extracts the uploaded archive into this request's own directory, then imports it.
     *
     * @param extractPath - This request's extraction directory.
     * @param filePath - Storage key of the uploaded archive.
     * @param cleanup - Whether to wipe the tenant's existing rows first (`ImportTypeEnum.CLEAN`).
     */
    unzipAndParse(extractPath: string, filePath: string, cleanup?: boolean): Promise<void>;
    parse(extractPath: string, cleanup?: boolean): Promise<void>;
    parseRelationalTables(extractPath: string, entity: IRepositoryModel, cleanup?: boolean): Promise<void>;
    migrateImportEntityRecord(item: IRepositoryModel, entity: any): Promise<any>;
    mappedImportRecord(item: IRepositoryModel, destination: any, row: any): Promise<any>;
    mapFields(item: IRepositoryModel, data: any): Promise<any>;
    mapTimeStampsFields(item: IRepositoryModel, data: any): Promise<any>;
    /**
     * Helper function to map a list of foreign key relations.
     * It uses the ImportRecordFindOrFailCommand to resolve destination IDs from source IDs (cdv files).
     *
     * @param data - The current row of CSV data being processed.
     * @param relationSet - An array of relation definitions containing column name and  referenced repository.
     */
    private mapRelationSet;
    mapRelationFields(item: IRepositoryModel | IColumnRelationMetadata<any>, data: any): Promise<any>;
    addCurrentUserToImportedOrganizations(extractPath: string): Promise<unknown>;
}
