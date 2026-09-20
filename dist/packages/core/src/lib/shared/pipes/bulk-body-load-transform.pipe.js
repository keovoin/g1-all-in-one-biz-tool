"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkBodyLoadTransformPipe = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let BulkBodyLoadTransformPipe = class BulkBodyLoadTransformPipe {
    transform(value, metadata) {
        return { list: value };
    }
};
exports.BulkBodyLoadTransformPipe = BulkBodyLoadTransformPipe;
exports.BulkBodyLoadTransformPipe = BulkBodyLoadTransformPipe = tslib_1.__decorate([
    (0, common_1.Injectable)()
], BulkBodyLoadTransformPipe);
//# sourceMappingURL=bulk-body-load-transform.pipe.js.map