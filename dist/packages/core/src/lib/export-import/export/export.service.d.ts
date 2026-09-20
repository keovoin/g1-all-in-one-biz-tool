import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { IRepositoryModel, RepositoriesService } from '../repositories/repositories.service';
/**
 * Everything one `/export` request needs to know about its own files.
 *
 * 🛑 This used to live on the service as `idCsv`/`idZip` RxJS subjects plus a `_dirname` field, and
 * `ExportService` is an ordinary singleton provider. A full export loops every repository in the
 * graph with a database round-trip each, so it spans seconds of real async I/O — long enough for a
 * second tenant's request to call `createFolders()` in the middle of the first one and move the
 * shared ids out from under it. Tenant A then archived tenant B's directory, or deleted it
 * (GHSA-g235-c4fm-4fc7). Passing the job explicitly is what makes the singleton safe; it is not a
 * style preference.
 */
export interface IExportJob {
    /** Unique id of this job. Also the stem of the archive's file name. */
    readonly id: string;
    /** Private scratch root for this job, removed by {@link ExportService.cleanup}. */
    readonly workDir: string;
    /** Directory the per-table CSVs are written into; becomes the archive's root. */
    readonly csvDir: string;
    /** Absolute path of the ZIP that is streamed to the caller. */
    readonly archivePath: string;
    /** File name the caller sees in `Content-Disposition` — unchanged: `<uuid>_export.zip`. */
    readonly archiveName: string;
}
export declare class ExportService {
    private repositoriesServices;
    private readonly logger;
    /**
     * The export/import repository graph, built once.
     *
     * It is derived entirely from `RepositoriesService`'s module-init state (core repositories plus
     * the plugin entities discovered at boot) and never from the request, so one shared copy is
     * correct — unlike the file paths above. Caching it also fixes `/export/template`, which never
     * called `registerAllRepositories()` and therefore produced an EMPTY template archive unless
     * some earlier `/export` request happened to have populated the field first.
     */
    private repositories;
    constructor(repositoriesServices: RepositoriesService);
    /**
     * Builds (once) and returns the repository graph to export.
     */
    private getRepositories;
    /**
     * Creates a private scratch directory for one export request.
     *
     * 🛑 The scratch root is `os.tmpdir()`, deliberately NOT `assetOptions.assetPublicPath`. That
     * directory is mounted by `ServeStaticModule` at `/public/` with no authentication, so every
     * intermediate CSV and the finished ZIP used to be downloadable over HTTP for as long as they
     * existed — and forever when a request failed before the delete step.
     *
     * `mkdtemp` creates the directory owner-only (0700) on POSIX, so other local users of a shared
     * `/tmp` cannot list or read another tenant's CSVs; the `csv` subdirectory is created 0700 too.
     *
     * If setup fails after the scratch root exists, the root is removed before the error propagates:
     * the caller never receives a job handle in that case, so nothing else could clean it up.
     *
     * @returns The job handle to thread through the rest of the export.
     */
    createExportJob(): Promise<IExportJob>;
    /**
     * Removes everything this job wrote. Safe to call twice, and safe to call on a job whose export
     * threw half-way — which is exactly why the controller calls it from a `finally`.
     *
     * @param job - The job to clean up.
     */
    cleanup(job: IExportJob): Promise<void>;
    /**
     * Zips this job's CSV directory into this job's archive.
     *
     * @param job - The job being exported.
     */
    archiveAndDownload(job: IExportJob): Promise<void>;
    /**
     * Reads one table and writes it as a CSV inside the job's directory.
     *
     * @param job - The job being exported.
     * @param item - The repository graph entry to export.
     * @param where - Tenant scope of the export.
     * @param organizationId - Organization the global default rows are stamped with.
     */
    getAsCsv(job: IExportJob, item: IRepositoryModel, where: {
        tenantId: string;
    }, organizationId?: string): Promise<boolean>;
    /**
     * Turns hydrated entities into the plain rows that go into the archive.
     *
     * 🛑 This is the single choke point for secret masking on the export path, and it has to be here
     * rather than in the writer: `csv-writer` reads `object[property]` directly and never runs
     * `class-transformer`, so `@Exclude({ toPlainOnly: true })` and the `@Expose`d `wrapSecret*`
     * mirrors — the whole of the JSON path's masking — simply do not apply to a CSV
     * (GHSA-j5h5-r956-rxc3). Columns opt in declaratively with `@ExportRedacted()`.
     *
     * Rows are also projected onto the entity's persisted columns, which drops the properties
     * subscribers attach on load (`IntegrationSettingSubscriber.wrapSecretValue`) and the computed
     * `@VirtualMultiOrmColumn` ones. Neither round-trips, and both are a route for a future
     * subscriber to put a cleartext credential back into the archive behind the column marks' back.
     *
     * @param repository - The repository the rows were loaded from.
     * @param rows - Hydrated entities.
     * @returns Plain objects safe to hand to `csv-writer`.
     */
    private redactRows;
    /**
     * Writes one CSV file into the job's directory.
     *
     * @param job - The job being exported.
     * @param filename - Table name (the CSV's stem).
     * @param items - Plain rows to write.
     */
    csvWriter(job: IExportJob, filename: string, items: Record<string, unknown>[]): Promise<void>;
    /**
     * Writes an empty CSV carrying only the table's column headers.
     *
     * @param job - The job being exported.
     * @param filename - Table name (the CSV's stem).
     * @param columns - Column names to use as the header.
     */
    csvTemplateWriter(job: IExportJob, filename: string, columns: string[]): Promise<void>;
    /**
     * Streams this job's archive to the caller.
     *
     * Resolves only once the response has actually been written, so the controller's `finally` can
     * delete the file without racing the stream (which truncates downloads on Windows/Electron).
     *
     * @param job - The job whose archive to send.
     * @param res - The Express response.
     */
    downloadToUser(job: IExportJob, res: any): Promise<void>;
    /**
     * Exports every table in the graph.
     *
     * @param job - The job being exported.
     * @param organizationId - Organization the global default rows are stamped with.
     */
    exportTables(job: IExportJob, organizationId: string): Promise<boolean>;
    /**
     * Exports only the named tables.
     *
     * @param job - The job being exported.
     * @param names - Table names requested by the caller.
     * @param organizationId - Organization the global default rows are stamped with.
     */
    exportSpecificTables(job: IExportJob, names: string[], organizationId?: string): Promise<boolean>;
    exportRelationalTables(job: IExportJob, entity: IRepositoryModel, where: {
        tenantId: string;
    }): Promise<void>;
    /**
     * Refuses to write junction rows that carry anything besides the junction table's own columns.
     *
     * `exportRelationalTables` selects `<junction>.*` as raw SQL and cannot redact, because there is no
     * entity class behind the rows. Today a many-to-many junction holds only its two foreign keys; if a
     * future junction (or a mis-resolved table name) returns other columns, fail closed rather than
     * write them without redaction.
     *
     * @param junction - Metadata of the junction entity the rows should belong to.
     * @param tableName - The table the rows were read from, for the error message.
     * @param rows - The raw rows returned by the query.
     * @throws TypeError when a row carries a column the junction does not declare as a foreign key.
     */
    assertJunctionRowsOnly(junction: {
        columns: ColumnMetadata[];
    } | undefined, tableName: string, rows: Record<string, unknown>[]): void;
    /**
     * Writes a header-only CSV for every table in the graph (the import template).
     *
     * @param job - The job being exported.
     */
    exportSpecificTablesSchema(job: IExportJob): Promise<boolean>;
    /**
     * Writes header-only CSVs for the many-to-many junction tables.
     *
     * @param job - The job being exported.
     * @param entity - The repository graph entry whose relations to describe.
     */
    exportRelationalTablesSchema(job: IExportJob, entity: IRepositoryModel): Promise<void>;
}
