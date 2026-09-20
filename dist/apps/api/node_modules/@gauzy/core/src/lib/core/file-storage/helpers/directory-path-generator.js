"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryPathGenerator = void 0;
// Concrete implementation of the path generator
const moment = require("moment");
const path = require("path");
const uuid_1 = require("uuid");
const context_1 = require("../../context");
class DirectoryPathGenerator {
    /**
     * Generates a base directory path by appending the current date in `YYYY/MM/DD` format
     * to the provided base directory name.
     *
     * @param baseDirname - The base directory name to which the date-based subdirectory will be appended.
     * @returns The full directory path including the date-based subdirectory.
     * @throws Error if the `baseDirname` parameter is empty or undefined.
     */
    getBaseDirectory(baseDirname) {
        if (!baseDirname) {
            throw new Error('baseDirname cannot be empty');
        }
        return path.join(baseDirname, moment().format('YYYY/MM/DD'));
    }
    /**
     * Generates a subdirectory path specific to the current user context.
     * Uses the `tenantId` and `employeeId` from the current user, or generates UUIDs if not available.
     *
     * @returns The subdirectory path in the format `<tenantId>/<employeeId>`.
     */
    getSubDirectory() {
        // Retrieve the current user from the request context
        const user = context_1.RequestContext.currentUser();
        // Extract or generate identifiers for the tenant and employee
        const tenantId = user?.tenantId || (0, uuid_1.v4)(); // Use the tenantId if available, otherwise generate a UUID
        const employeeId = user?.employeeId || (0, uuid_1.v4)(); // Use the employeeId if available, otherwise generate a UUID
        // Construct and return the subdirectory path
        return path.join(tenantId, employeeId);
    }
}
exports.DirectoryPathGenerator = DirectoryPathGenerator;
//# sourceMappingURL=directory-path-generator.js.map