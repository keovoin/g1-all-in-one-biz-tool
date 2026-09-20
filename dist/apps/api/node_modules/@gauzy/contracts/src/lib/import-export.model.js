"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportStatusEnum = exports.ImportTypeEnum = void 0;
var ImportTypeEnum;
(function (ImportTypeEnum) {
    ImportTypeEnum["MERGE"] = "merge";
    ImportTypeEnum["CLEAN"] = "clean";
})(ImportTypeEnum || (exports.ImportTypeEnum = ImportTypeEnum = {}));
var ImportStatusEnum;
(function (ImportStatusEnum) {
    ImportStatusEnum["SUCCESS"] = "Success";
    ImportStatusEnum["FAILED"] = "Failed";
    ImportStatusEnum["CANCELLED"] = "Cancelled";
    ImportStatusEnum["IN_PROGRESS"] = "In Progress";
})(ImportStatusEnum || (exports.ImportStatusEnum = ImportStatusEnum = {}));
//# sourceMappingURL=import-export.model.js.map