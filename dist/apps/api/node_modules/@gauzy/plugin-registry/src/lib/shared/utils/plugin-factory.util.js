"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginFactory = void 0;
const core_1 = require("@gauzy/core");
class PluginFactory {
    static create(input) {
        return {
            ...input,
            uploadedById: input.uploadedById || core_1.RequestContext.currentEmployeeId(),
            version: this.createVersion(input.version)
        };
    }
    static createVersion(input) {
        return {
            ...input,
            sources: this.createSource(input.sources)
        };
    }
    static createSource(inputs) {
        return inputs.map((input) => ({
            ...input
        }));
    }
}
exports.PluginFactory = PluginFactory;
//# sourceMappingURL=plugin-factory.util.js.map