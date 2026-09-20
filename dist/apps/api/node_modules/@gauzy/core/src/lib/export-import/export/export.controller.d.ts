import { ExportService } from './export.service';
/**
 * 🛑 Every handler here follows the same shape: take a job, do the work inside a `try`, and clean
 * the job's scratch directory up in a `finally`.
 *
 * Two defects are closed by that shape. The job makes each request use only its OWN files, where
 * the service used to keep the current csv/zip ids in shared singleton fields that a concurrent
 * request could overwrite mid-export (GHSA-g235-c4fm-4fc7). The `finally` makes the delete
 * unconditional, where a throw anywhere in the sequence used to leave the plaintext CSVs and the
 * archive on disk indefinitely.
 */
export declare class ExportController {
    private readonly _exportService;
    constructor(_exportService: ExportService);
    exportAll(data: any, organizationId: string, res: any): Promise<any>;
    downloadTemplate(res: any): Promise<any>;
    exportByName(data: any, headers: Record<string, string>, res: any): Promise<any>;
}
