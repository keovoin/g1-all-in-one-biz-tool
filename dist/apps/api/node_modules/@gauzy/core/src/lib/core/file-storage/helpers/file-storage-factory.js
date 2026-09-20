"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageFactory = void 0;
const path = require("path");
const file_storage_1 = require("../file-storage");
const directory_path_generator_1 = require("./directory-path-generator");
// FileStorageFactory
class FileStorageFactory {
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
    static create(baseDirname) {
        const baseDirectory = this.pathGenerator.getBaseDirectory(baseDirname);
        const subDirectory = this.pathGenerator.getSubDirectory();
        return new file_storage_1.FileStorage().storage({
            dest: () => path.join(baseDirectory, subDirectory),
            prefix: baseDirname
        });
    }
}
exports.FileStorageFactory = FileStorageFactory;
FileStorageFactory.pathGenerator = new directory_path_generator_1.DirectoryPathGenerator();
//# sourceMappingURL=file-storage-factory.js.map