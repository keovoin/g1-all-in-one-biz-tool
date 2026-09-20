import { IDirectoryPathGenerator } from './directory-path-generator.interface';
export declare class DirectoryPathGenerator implements IDirectoryPathGenerator {
    /**
     * Generates a base directory path by appending the current date in `YYYY/MM/DD` format
     * to the provided base directory name.
     *
     * @param baseDirname - The base directory name to which the date-based subdirectory will be appended.
     * @returns The full directory path including the date-based subdirectory.
     * @throws Error if the `baseDirname` parameter is empty or undefined.
     */
    getBaseDirectory(baseDirname: string): string;
    /**
     * Generates a subdirectory path specific to the current user context.
     * Uses the `tenantId` and `employeeId` from the current user, or generates UUIDs if not available.
     *
     * @returns The subdirectory path in the format `<tenantId>/<employeeId>`.
     */
    getSubDirectory(): string;
}
