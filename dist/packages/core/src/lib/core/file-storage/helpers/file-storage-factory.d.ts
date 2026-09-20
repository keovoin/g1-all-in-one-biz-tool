import * as multer from 'multer';
export declare class FileStorageFactory {
    private static readonly pathGenerator;
    /**
     * Creates a multer storage engine configured with a custom file storage system.
     *
     * This function generates the base directory and subdirectory paths based on
     * the provided `baseDirname`, and returns a `multer.StorageEngine` instance
     * that saves files to these paths.
     *
     * @param {string} baseDirname - The base directory name used to generate the file storage path.
     * @returns {multer.StorageEngine} - A multer storage engine configured to store files.
     */
    static create(baseDirname: string): multer.StorageEngine;
}
