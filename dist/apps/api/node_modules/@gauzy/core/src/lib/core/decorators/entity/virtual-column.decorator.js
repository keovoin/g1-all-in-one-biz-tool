"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualMultiOrmColumn = VirtualMultiOrmColumn;
const core_1 = require("@mikro-orm/core");
/**
 * Custom decorator to define a non-persistent (virtual) column in a MikroORM entity.
 *
 * @param options Additional options for the property. Defaults to { persist: false }.
 * @returns A property decorator function.
 */
function VirtualMultiOrmColumn(options = {
    persist: false
}) {
    return (target, propertyKey) => {
        (0, core_1.Property)(options)(target, propertyKey);
    };
}
//# sourceMappingURL=virtual-column.decorator.js.map